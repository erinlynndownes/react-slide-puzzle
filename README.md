# React Slide Puzzle

A classic 8 or 15 puzzle that I built with React that has interactive sliding tiles. The ai solver uses the fringe search algorithm and manhattan distance heuristic, which is sufficient for the 8 piece puzzle. For the 15 piece a non-optimal but short solution is found by breaking up the problem and stringing together those solutions, an idea based on [this](https://pdfs.semanticscholar.org/21be/9f73ab7afb7991b8cfbdaf96e4124a0bec89.pdf) paper by Ian Parberry.

While most configurations of the 15 puzzle are solved within a few seconds, the hardest can take up from 30 to 50 seconds. For this reason the solution is carried out in a web worker so the browser doesn't lock up. This puzzle works great on mobile devices due to the responsive design of the layout and memory efficient ai.

## Demo

[https://slidepuzzletest.erinlynnlouise.net/](http://slidepuzzletest.erinlynnlouise.net/)

## Getting started

   ### start

    First clone the repo to your local server and then install dependencies and start.
    ```
    npm install
    npm start
    ```
   ### build
    npm run build

## Built with

[Create React App](https://github.com/facebook/create-react-app)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

## Acknowledgements

Since I was using this project to learn React, I took inspiration from [https://github.com/cedricblondeau/sliding-puzzle](https://github.com/cedricblondeau/sliding-puzzle) and [https://github.com/unindented/react-puzzle](https://github.com/unindented/react-puzzle).

The 15-puzzle solution is based on the idea from Ian Parberry's paper [A Memory-Efficient Method for Fast Computation of Short 15-Puzzle Solutions](https://pdfs.semanticscholar.org/21be/9f73ab7afb7991b8cfbdaf96e4124a0bec89.pdf)

Fringe Search adapted from psuedocode at [https://en.wikipedia.org/wiki/Fringe_search](https://en.wikipedia.org/wiki/Fringe_search)

