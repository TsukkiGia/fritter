/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {Types, HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import type {Refreet} from '../refreet/model';
import UserCollection from '../user/collection';
import LikeCollection from '../like/collection';
import RefreetCollection from '../refreet/collection';
import DownvoteCollection from '../downvote/collection';
import FollowCollection from '../follow/collection';
import FreetCollection from './collection';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  displayName: string;
  authorId: string;
  profilePictureColor: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  timeOfDeletion: string;
  parentFreet: string;
  isRefreet: string;
  viewers: string[];
  commentPropagation: string;
  likers: string[];
  refreeters: string[];
  downvoters: string[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

function isRefreet(item: Refreet | Freet): item is Refreet {
  return (item as Refreet).refreetedItem !== undefined;
}

async function refreetsCommentsAndFreets(userId: string): Promise<FreetResponse[]> {
  const followingList = await FollowCollection.getFollowingList(userId);
  const freets = [];
  const freetsToAwait = [];
  for (const following of followingList) {
    const followedUser = following.followedUser.toString();
    freetsToAwait.push(FreetCollection.findAllById(followedUser));
    freetsToAwait.push(RefreetCollection.findRefreetsByRefreeter(followedUser));
  }

  const awaitedFreets = await Promise.all(freetsToAwait);
  for (const freetList of awaitedFreets) {
    freets.push(...freetList);
  }

  freets.sort((first, second) => {
    const firstDate: Date = first.dateCreated;
    const secondDate: Date = second.dateCreated;
    return firstDate.getTime() - secondDate.getTime();
  });

  const newFreets = freets.map(async freetItem => {
    const freet: Freet = isRefreet(freetItem) ? await FreetCollection.findOne(freetItem.refreetedItem) : freetItem;
    const user = await UserCollection.findOneByUserId(freet.authorId);
    const freetCopy: PopulatedFreet = {
      ...freet,
      authorId: user
    };
    const likes = await LikeCollection.getLikesOfItem(freet._id.toString());
    const refreets = await RefreetCollection.getRefreetsofItem(freet._id.toString());
    const downvotes = await DownvoteCollection.getDownvotesOfItem(freet._id.toString());
    const niceLikers = [];
    const niceRefreeters = [];
    const niceDownvoters = [];
    for (const like of likes) {
      niceLikers.push(like.liker.toString());
    }

    for (const refreet of refreets) {
      niceRefreeters.push(refreet.refreeter.toString());
    }

    for (const downvote of downvotes) {
      niceDownvoters.push(downvote.downvoter.toString());
    }

    const {username, displayName, profilePictureColor, _id} = freetCopy.authorId;
    return {
      ...freet,
      _id: freet._id.toString(),
      author: username,
      displayName,
      authorId: _id.toString(),
      profilePictureColor,
      dateCreated: formatDate(freet.dateCreated),
      dateModified: formatDate(freet.dateModified),
      timeOfDeletion: (freet.timeOfDeletion === null || freet.timeOfDeletion === undefined) ? '' : formatDate(freet.timeOfDeletion),
      parentFreet: (freet.parentFreet === null || freet.parentFreet === undefined) ? '' : freet.parentFreet.toString(),
      isRefreet: isRefreet(freetItem) ? 'true' : 'false',
      viewers: freet.viewers,
      commentPropagation: (freet.commentPropagation === null || freet.commentPropagation === undefined) ? '' : freet.commentPropagation.toString(),
      likers: niceLikers,
      refreeters: niceRefreeters,
      downvoters: niceDownvoters
    };
  });
  return Promise.all(newFreets);
}

async function hideFreetsFromPrivateUsers(freets: Freet[]): Promise<Freet[]> {
  const filtered_freets = [];
  const usersPromises = [];
  for (const freet of freets) {
    const {authorId} = freet;
    usersPromises.push(UserCollection.findOneByUserId(authorId));
  }

  const userToPrivate = new Map<string, boolean>();
  const users = await Promise.all(usersPromises);
  for (const user of users) {
    userToPrivate.set(user._id.toString(), user.isPrivate);
  }

  for (const freet of freets) {
    if (!userToPrivate.get(freet.authorId.toString())) {
      filtered_freets.push(freet);
    }
  }

  return filtered_freets;
}

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = async (freet: HydratedDocument<Freet>): Promise<FreetResponse> => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username, displayName, profilePictureColor, _id} = freetCopy.authorId;
  const likes = await LikeCollection.getLikesOfItem(freet._id.toString());
  const refreets = await RefreetCollection.getRefreetsofItem(freet._id.toString());
  const downvotes = await DownvoteCollection.getDownvotesOfItem(freet._id.toString());

  const niceLikers = [];
  const niceRefreeters = [];
  const niceDownvoters = [];
  for (const like of likes) {
    niceLikers.push(like.liker.toString());
  }

  for (const refreet of refreets) {
    niceRefreeters.push(refreet.refreeter.toString());
  }

  for (const downvote of downvotes) {
    niceDownvoters.push(downvote.downvoter.toString());
  }

  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    displayName,
    authorId: _id.toString(),
    profilePictureColor,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
    timeOfDeletion: (freet.timeOfDeletion === null || freet.timeOfDeletion === undefined) ? '' : formatDate(freet.timeOfDeletion),
    parentFreet: (freetCopy.parentFreet === null || freetCopy.parentFreet === undefined) ? '' : freetCopy.parentFreet.toString(),
    isRefreet: 'false',
    viewers: freetCopy.viewers,
    commentPropagation: (freetCopy.commentPropagation === null || freetCopy.commentPropagation === undefined) ? '' : freetCopy.commentPropagation.toString(),
    likers: niceLikers,
    refreeters: niceRefreeters,
    downvoters: niceDownvoters
  };
};

export {
  constructFreetResponse,
  hideFreetsFromPrivateUsers,
  refreetsCommentsAndFreets
};
