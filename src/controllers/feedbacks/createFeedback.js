import createHttpError from 'http-errors';

import { Feedback } from '../../models/feedback.js';
import { Location } from '../../models/location.js';

export const createFeedback = async (req, res, next) => {
  try {
    const { locationId, rate, description } = req.body;

    const location = await Location.findById(locationId);

    if (!location) {
      throw createHttpError(404, 'Location not found');
    }

    const feedback = await Feedback.create({
      locationId,
      rate,
      description,
      userName: req.user.name,
    });

    location.feedbacksId.push(feedback._id);

    const feedbacks = await Feedback.find({
      _id: { $in: location.feedbacksId },
    }).select('rate');

    const averageRate =
      feedbacks.reduce((sum, item) => sum + item.rate, 0) / feedbacks.length;

    location.rate = Math.round(averageRate * 2) / 2;

    await location.save();

    return res.status(201).json({ data: feedback });
  } catch (error) {
    next(error);
  }
};
