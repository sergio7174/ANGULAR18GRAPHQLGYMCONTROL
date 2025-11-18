const { GraphQLScalarType, Kind } = require('graphql');

    const GraphQLDate = new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      serialize(value) {
        // Convert outgoing Date to ISO string
        return value.toISOString();
      },
      parseValue(value) {
        // Convert incoming string to Date object
        return new Date(value);
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
          // Convert string literal to Date object
          return new Date(ast.value);
        }
        return null;
      },
    });

    module.exports = GraphQLDate;