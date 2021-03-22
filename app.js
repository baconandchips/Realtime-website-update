const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const moment = require('moment')

// We're building services in the form of classes. We only have 1 service that deals with our ideas.

// Idea Service
class IdeaService {
    constructor() {
        this.ideas = [];
    }

    // Find and return our ideas
    async find() {
        return this.ideas;
    }

    // Takes in data from client
    async create(data) {
        // In a db the id gets created for you
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }

        idea.time = moment().format('h:mm:ss a'); // gives us the time, and attaches it to the ideas object

        this.ideas.push(idea);

        return idea;
    }
}

// Initialization
const app = express(feathers()); // Integrate feathers with express

// Add middleware! Parse JSON
app.use(express.json());
// Configure Socket.io realtime APIs
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register our services
app.use('/ideas', new IdeaService()); // We can have multiple services, but we're only using one here!

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));

// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Realtime server running on port ${PORT}`));

// app.service('ideas').create({
//     text: 'Build a cool app',
//     tech: 'Node.js',
//     viewer: 'John Doe',
//     time: moment().format('h:mm:ss a')
// });