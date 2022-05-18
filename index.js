//Importing modules and dependencies
const { ApolloServer, gql } = require("apollo-server");
const data = require('./MOCK_DATA.json');
const { readFileSync } = require('fs');
const jwt = require('jsonwebtoken')
const typeDefs = readFileSync(require.resolve('./schemas.graphql')).toString('utf-8')

const resolvers = {
    // The name of the resolver must match the name of the query in the typeDefs
    Query: {
        // When the hello query is invoked "Hello world" should be returned
        hello: () => "Hello world!",
        randomNumber: () => Math.round(Math.random() * 10),
        queryUsers: () => data,
        queryUserById: (parent, args) => {
            return data.find(x => x.id == args.id)
        },
        queryLogin: (parent, args) => {
            let obj = data.find(x => x.email == args.email)
            if (obj) {
                if (obj.password == args.password) {
                    let token = jwt.sign({ id: obj.id, email: args.email },'jwtsecretkeyishere')
                    return { ok: true, message: "Login Success", token }
                }
            }
            return { ok: false, message: "Login Failure" }
        }

    },

    Mutation: {
        // Once again notice the name of the resolver matches what we defined in our typeDefs
        // The first argument to any resolver is the parent, which is not important to us here
        // The second argument, args, is an object containing all the arguments passed to the resolver
        addUser: (parent, args) => {
            let obj = { id: data.length + 1, first_name: args.first_name, last_name: args.last_name, email: args.email }
            data.push(obj); // Push the new user to the users array
            return obj; // Returns the arguments provided, this is the new user we just added
        },
    }
};

const server = new ApolloServer({
    // If the object key and value have the same name, you can omit the key
    typeDefs,
    resolvers,
});

// Start the server at port 8080
server.listen({ port: 8080 }).then(({ url }) => console.log(`GraphQL server running at ${url}`));