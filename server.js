import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id: "1",
        text: "hello",
        userId: "1",
    },
    {
        id: "2",
        text: "hello two",
        userId: "2",
    },
]

let users = [
    {
        id: "1",
        firstName: "stan",
        lastName: "jang"
    },
    {
        id: "2",
        firstName: "elon",
        lastName: "mask"
    },
]

const typeDefs = gql`
type User {
    id: ID!
    firstName:String!
    lastName:String!
    fullName:String!
}
type Tweet {
    id:ID!
    text:String!
    author:User
}
type Query {
    allUsers:[User!]!
    allTweets:[Tweet!]!
    tweet(id:ID!): Tweet
}

type Mutation {
    postTweet(text:String!, userId:ID!): Tweet!
    deleteTweet(id:ID!): Boolean!
}
`

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, { id }) {
            return tweets.find((tweet) => tweet.id === id);
        },
        allUsers() {
            return users;
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
                userId,
            };
            tweets.push(newTweet);
            return newTweet
        },
        deleteTweet(_, { id }) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        }
    },
    User: {
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`
        }
    },
    Tweet: {
        author({ userId }) {
            return users.find((user) => user.id === userId);
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`running on ${url}`)
})