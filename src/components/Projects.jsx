import React, { useEffect, useState } from 'react';
import '../styles/Projects.css';
import { GitHubIcon } from "./icons"

const Projects = () => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='container'>
            {showContent &&(
                <div className='projects-title'>
                    <h1>Projects</h1>
                </div>
            )}
            {showContent && (
                <div className="content">
                        <div className='project-tile website'>
                            <h2>ronkiehn.dev
                            <a className="icon-link" href="https://github.com/ronthekiehn/ronkiehn.dev" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>React, Node.js, Gemini API, Spotify API, GitHub Pages, Vercel</div>
                            <p>This website! Built with React, Vite, and Node.js. Complete with a chatbot that impersonates me, my Spotify listening, and some smooth transitions.</p>
                            <p className='note'>Hope you like it!</p>
                        </div>

                        <div className='project-tile cube-web'>
                            <h2>Cube-Web
                            <a className="icon-link" href="https://github.com/ronthekiehn/cube-web" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>C, Javascript, WASM, Github Pages</div>
                            <p>The spinning cube is now in your browser with the power of WASM</p>
                            <p className='note'><a href="https://ronthekiehn.github.io/cube-web/" target="_blank" rel="noreferrer">Try it out here!</a></p>
                        </div>

                        <div className='project-tile nootunez'>
                            <h2>nootunez.com (BetterSpotifyRecs)
                            <a className="icon-link" href="https://github.com/ronthekiehn/BetterSpotifyRecs" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>HTML, CSS, JS, Node.js, Spotify API, Heroku, Vercel, Firebase</div>
                            <p>Full-stack web app to generate unique Spotify recommendation.</p>
                            <p className='note'>Awaiting Spotify API extension for full release.</p>
                        </div>

                        <div className='project-tile goodreads'>
                            <h2>Review Consensus for Goodreads
                            <a className="icon-link" href="https://github.com/ronthekiehn/Goodreads" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>JavaScript, Gemini API, Vercel</div>
                            <p>Chrome extension that write an AI-generated review consensus for books Goodreads.com.</p>
                            <p className='note'><a href="https://chromewebstore.google.com/detail/review-consensus-for-good/klpimcobgdoeidognoplffkaajjialid?authuser=0&hl=en" target="_blank" rel="noreferrer">Install it here</a></p>
                        </div>

                        <div className='project-tile dawand'>
                            <h2>DAWand Blender
                            </h2>
                            
                            <div className='languages'>Python, PyTorch, Blender API</div>
                            <p>Add-on that runs Richard Liu and 3DL's DAWand in Blender.</p>
                            <p className='note'>Releasing Summer 2024. <a href='https://github.com/threedle/DA-Wand' target="_blank" rel="noreferrer">See the original here</a></p>
                        </div>

                        <div className='project-tile aurelius'>
                            <h2>Daily Aurelius
                            <a className="icon-link" href="https://github.com/ronthekiehn/Daily-Aurelius" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>JavaScript, Python</div>
                            <p>Chrome extension that shows a new quote from Marcus Aurelius's Meditations every day.</p>
                            <p className='note'><a href="https://chromewebstore.google.com/detail/daily-aurelius/pnmaadcfpnogifckbhhbmfflkbjoekji" target="_blank" rel="noreferrer">Install it here</a></p>
                        </div>

                        <div className='project-tile gordon'>
                            <h2>Direct Volume Renderer
                            </h2>
                            <div className='languages'>C</div>
                            <p>Multi-threaded application to visualize real-world 3D volume datasets (MRI scans).</p>
                            <p className='note'>This was a school project, so I can't share the code</p>
                        </div>

                        <div className='project-tile cube'>
                            <h2>Cube
                            <a className="icon-link" href="https://github.com/ronthekiehn/Cube" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>C, Python</div>
                            <p>Takes a simple spinning cube and adds a ton of features, including zooming, terminal resizing, and mouse and keyboard control.</p>
                            <p className='note'>Probably only works on Mac</p>
                        </div>

                        <div className='project-tile rasterizer'>
                            <h2>3D Rasterizer
                            </h2>
                            <div className='languages'>Python, Pillow</div>
                            <p>3D rasterizer that visualizes a cube using a half-edge data structure.</p>
                            <p className='note'>This was a school project, so I can't share the code</p>
                        </div>

                        <div className='project-tile minesweeper'>
                            <h2>Minesweeper Solver
                            </h2>
                            <div className='languages'>Python, CVXPy</div>
                            <p>Implements a linear programming algorithm to solve minesweeper.</p>
                            <p className='note'>This was a school project, so I can't share the code</p>
                        </div>
                    

                        <div className='project-tile dune'>
                            <h2>Dune2Risk
                            <a className="icon-link" href="https://github.com/ethaneig/dune2risk" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>Python, PyGame</div>
                            <p>Uncommon Hacks 2024 Best Game Winner 🏆 <br></br>Dune 2 Risk. It's like Risk but Dune. Made in Pygame. </p>
                            <p className='note'><a href="https://uncommon-hacks-2024.devpost.com/project-gallery" target="_blank" rel="noreferrer">See the full hackathon devpost here</a></p>
                        </div>

                        <div className='project-tile funkopop'>
                            <h2>PopPriceGuide Scraper
                            <a className="icon-link" href="https://github.com/ronthekiehn/FunkoPop-Scraper" target="_blank" rel="noreferrer">
                                <GitHubIcon />
                            </a>
                            </h2>
                            
                            <div className='languages'>Python, Selenium, Beautifulsoup, re</div>
                            <p>A small web scraper for PopPriceGuide to find the price of a Funko Pop.</p>
                            <p className='note'>My first time web scraping!</p>
                    
                        </div>
                            <div className='project-tile shell'>
                            <h2>Shell
                            </h2>
                            <div className='languages'>C</div>
                            <p>Simulates a computer shell.</p>
                            <p className='note'>This was a school project, so I can't share the code</p>
                        </div>

                        <div className='project-tile cache'>
                            <h2>Cache Simulator
                            </h2>
                            <div className='languages'>C</div>
                            <p>Analyzes Valgrind memory traces and cache performance, identifying hits, misses, and evictions.</p>
                            <p className='note'>This was a school project, so I can't share the code</p>
                        </div>

                   </div>
            )}
        </div>
    );
};

export default Projects;