import type {HydratedDocument, Types} from 'mongoose';
import type {Notification} from './model';
import NotificationModel from './model';

class NotificationCollection {
  // For like comment, refreet
  static async addFreetNotification(receivingUser: string, sendingUser: string, notifFreet: string, notifType: string): Promise<HydratedDocument<Notification>> {
    const notification = new NotificationModel(
      {
        notificationReceiver: receivingUser,
        notificationType: notifType,
        notificationTime: Date.now(),
        notificationSender: sendingUser,
        notificationFreet: notifFreet
      }
    );
    await notification.save();
    return notification;
  }

  static async deleteNotification(receivingUser: string, sendingUser: string, notifFreet: string, notifType: string): Promise<boolean> {
    if (notifType === 'follow') {
      const notificationOne = await NotificationModel.deleteOne({notificationReceiver: receivingUser,
        notificationType: 'follow',
        notificationSender: sendingUser,
        notificationFreet: notifFreet});
      const notificationTwo = await NotificationModel.deleteOne({notificationReceiver: receivingUser,
        notificationType: 'followrequest',
        notificationSender: sendingUser,
        notificationFreet: notifFreet});
      return notificationOne !== null || notificationTwo !== null;
    }

    const notification = await NotificationModel.deleteOne({notificationReceiver: receivingUser,
      notificationType: notifType,
      notificationSender: sendingUser,
      notificationFreet: notifFreet});
    return notification !== null;
  }

  static async addFollowNotification(receivingUser: string, sendingUser: string, notifType: string, isFollowRequest: boolean): Promise<HydratedDocument<Notification>> {
    if (isFollowRequest) {
      const notification = new NotificationModel(
        {
          notificationReceiver: receivingUser,
          notificationType: notifType,
          notificationTime: Date.now(),
          notificationSender: sendingUser,
          hasAcceptedFollowRequest: 'received'
        }
      );
      await notification.save();
      return notification;
    }

    const notification = new NotificationModel(
      {
        notificationReceiver: receivingUser,
        notificationType: notifType,
        notificationTime: Date.now(),
        notificationSender: sendingUser
      }
    );
    await notification.save();
    return notification;
  }

  static async updateFollowRequestNotification(notificationId: Types.ObjectId, response: string): Promise<HydratedDocument<Notification>> {
    const notification = await NotificationModel.findOne({_id: notificationId});
    notification.hasAcceptedFollowRequest = response;
    await notification.save();
    return notification;
  }

  static async getNotificationsForUser(receivingUser: string): Promise<Array<HydratedDocument<Notification>>> {
    return NotificationModel.find({notificationReceiver: receivingUser}).populate('notificationSender');
  }

  static async findOneByNotificationId(notificationId: Types.ObjectId): Promise<HydratedDocument<Notification>> {
    return NotificationModel.findOne({_id: notificationId});
  }
}

export default NotificationCollection;
