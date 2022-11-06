import type {HydratedDocument} from 'mongoose';
import type {Notification} from './model';
import moment from 'moment';

type FreetNotificationResponse = {
  _id: string;
  notificationReceiver: string;
  notificationType: string;
  notificationTime: string;
  notificationSender: object;
  notificationFreet: string;
};

type FollowNotificationResponse = {
  _id: string;
  notificationReceiver: string;
  notificationType: string;
  notificationTime: string;
  notificationSender: object;
  hasAcceptedFollowRequest: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructFreetNotificationResponse = (notification: HydratedDocument<Notification>): FreetNotificationResponse =>
  ({
    _id: notification._id.toString(),
    notificationReceiver: notification.notificationReceiver.toString(),
    notificationType: notification.notificationType.toString(),
    notificationTime: formatDate(notification.notificationTime),
    notificationSender: notification.notificationSender,
    notificationFreet: notification.notificationFreet.toString()
  });

const constructFollowNotificationResponse = (notification: HydratedDocument<Notification>): FollowNotificationResponse =>
  ({
    _id: notification._id.toString(),
    notificationReceiver: notification.notificationReceiver.toString(),
    notificationType: notification.notificationType.toString(),
    notificationTime: formatDate(notification.notificationTime),
    notificationSender: notification.notificationSender,
    hasAcceptedFollowRequest: notification.hasAcceptedFollowRequest === undefined ? '' : notification.hasAcceptedFollowRequest.toString()
  });

export {
  constructFollowNotificationResponse,
  constructFreetNotificationResponse
};
