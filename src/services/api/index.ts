import { systemApi } from './system';
import { prospectApi } from './prospects';
import { leadApi } from './leads';
import { bucketApi } from './buckets';
import { tagApi } from './tags';
import { userApi } from './users';
import { aiApi } from './AI';

export const api = {
  getStatus: systemApi.getStatus,

  searchLeads: prospectApi.searchProspects,

  getFunilLeads: leadApi.getFunilLeads,
  saveLeadToFunil: leadApi.captureProspect,
  saveManualLeadToFunil: leadApi.saveManualLeadToFunil,
  importLeadsBulk: leadApi.importLeadsBulk,
  updateLeadBucket: leadApi.updateLeadBucket,
  updateLeadTag: leadApi.updateLeadTag,
  updateLeadNotes: leadApi.updateLeadNotes,
  deleteLead: leadApi.deleteLead,
  generateAIPitch: leadApi.generateAIPitch,
  getLeadInteractions: leadApi.getLeadInteractions,
  generateLeadReply: leadApi.generateLeadReply,
  transcribeAudio: leadApi.transcribeAudio,

  saveAiConfig: aiApi.saveAiConfig,
  getAiConfig: aiApi.getAiConfig,
  trainPersona: aiApi.trainPersona,
  simulateLeadReply: aiApi.simulateLeadReply,

  getBuckets: bucketApi.getBuckets,
  createBucket: bucketApi.createBucket,
  updateBucket: bucketApi.updateBucket,
  deleteBucket: bucketApi.deleteBucket,

  getTags: tagApi.getTags,
  createTag: tagApi.createTag,
  updateTag: tagApi.updateTag,
  deleteTag: tagApi.deleteTag,

  getProfile: userApi.getProfile

};
