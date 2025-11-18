// server/resolvers/mutations/RootMutation.js
const authMutations = require('./AuthMutation');
const categoryMutations = require('./CategoryMutation');
const classMutations = require('./ClassMutation');
const memberMutations = require('./MemberMutation');
const packageMutations = require('./PackageMutation');
const staffMutations = require('./StaffMutation');

module.exports = {
  ...authMutations,
  ...classMutations,
  ...categoryMutations,
  ...memberMutations,
  ...packageMutations,
  ...staffMutations,
};
