import { prospectApi } from './prospects';
import { leadApi } from './leads';
import { bucketApi } from './buckets';
import { tagApi } from './tags';

export const api = {
  searchLeads: prospectApi.searchProspects,

  getFunilLeads: leadApi.getFunilLeads,
  saveLeadToFunil: leadApi.captureProspect,
  saveManualLeadToFunil: leadApi.saveManualLeadToFunil,
  updateLeadBucket: leadApi.updateLeadBucket,
  updateLeadTag: leadApi.updateLeadTag,
  updateLeadNotes: leadApi.updateLeadNotes,
  deleteLead: leadApi.deleteLead,

  getBuckets: bucketApi.getBuckets,
  createBucket: bucketApi.createBucket,
  updateBucket: bucketApi.updateBucket,
  deleteBucket: bucketApi.deleteBucket,

  getTags: tagApi.getTags,
  createTag: tagApi.createTag,
  updateTag: tagApi.updateTag,
  deleteTag: tagApi.deleteTag
};
