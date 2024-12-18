---
title: "What I Learned From Making A Viral Website"
author: "Ron Kiehn"
date: "2024-02-15"
layout: "../layouts/BlogPost.astro"
---

Before I start, I want to thank the goat <a href="https://x.com/jaivinwylde" target="_blank">@jaivinwylde</a> for inspiring this project and boosting it, <a href="https://x.com/0xUltraInstinct" target="_blank">@0xUltraInstinct</a> and <a href="https://x.com/immunity" target="_blank">@immunity</a> for contributing to the project, and <a href="https://x.com/brianships" target="_blank">@brianships</a> for putting me on to the socialdata API and being extremely helpful. Also should out to <a href="https://x.com/aert0_" target="_blank">@aert0_</a> and <a href="https://x.com/crodaar" target="_blank">@crodaar</a> for making really cool forks of this project!

## 1. Finish Projects and Copy People

It's no secret what this project is. It says it at the top of the website. It's heavinly inspired, maybe even a clone of [@jaivinwylde's](https://x.com/jaivinwylde) [auralized.com](https://auralized.com). 

## 2. Svelte + Tailwind is Lovely 

I honestly don't have much to say about this. After weeks in the React mines, working on both a React website and a React Native app, Svelte was a breath of fresh air. The syntax is light, there's hardly any boilerplate, and things in Svelte just *work*. I highly recommend making even something small in Svelte, you won't want to go back (though you will have to).  
*note: this project was written in Svelte 4, I have not tried Svelte 5, but I have heard good things although it is somewhat different*


As for Tailwind, I had also been in the CSS trenches for months. Before this project, I was a Tailwind denier. The classnames looked ugly. Keeping your styles separate seemed smart.

Boy was I wrong. 

Tailwind CSS is the greatest webdev tool bar none. I would delete all JS frameworks and code in vanilla JS for the rest of my life if it meant I got to use Tailwind. I particularly love how easy it is to come back to a codebase and immediately understand the styling. Anyway, much has already been said about Tailwind, but for those still holding out, PLEASE, *just try it*, it will change your life. 


## 3. Don't Pay For Stuff (or do)

Here's the balance you have to find. You want to ship your project as fast as possible, but you don't want to just burn a bunch of money if it goes viral. Don't spend weeks on a side project, but also don't spend hundreds of dollars on a side project.  

In this case, I ended up spending hundreds of dollars on this (well like $150). 

## 4. Serverless is Great, Actually

Speaking of cost, there is a lot of hate for serverless going around. I think a lot of it is warranted. It's certainly true that using serverless platforms like Vercel aren't very good for *learning*. You'll be better off in the long term learning how to set up a VPS and connect it to your frontend. (my next project I plan on using Go and digitalocean)

### lets talk about vercel

But let's be honest, I don't have time for allat. And for a small project like this, Vercel, and other serverless platforms are extremely good for what's actually important, shipping. It is undeniable that this project would have taken me much longer if I wasn't able to host it on Vercel with one click. In the end it doesn't matter what tools or platform you use. Shipping is everything.

One concern I see a lot, and I even joked about it on the site, is the *cost* associated with serverless hosting, especially on Vercel. I think this concern is overblown, if you know what you're doing. This project, which has gotten over 900,000 uses, with over 2 million requests (mostly in the first 48 hours) to my three different API endpoints, cost me $22 to run on Vercel. Let me say that again. *2 million requests, twenty-two dollars*. This is *not* substantially more than it would cost to host this project on a VPS. In fact, the majority of that cost is upgrading to Vercel's paid tier ($20/month), *which I have now downgraded back to the free tier* now that the project is no longer generating more than 100,000 requests a month. 

Vercel's free tier is *amazing* and it let me scale this project to be exactly what I needed. Had I used a VPS, I would have to pay ~$10/month before I even had any users, and if I want to keep the site up, I would be stuck paying that *forever*. With Vercel, I was able to pay $0 *before* the site got any users, then I paid exactly for what I needed, and reduced my plan when I no longer needed it. Now the site is still up, and still works perfectly, with completely free hosting. 

Of course, you have to be careful with Vercel, because some things do run up costs. One to pay attention to is function duration, which in my case wasn't a problem, as my APIs were extremely small. That being said, Gemini does sometimes take up to a minute to generate a response, but I made sure to limit my funciton duration to 10s, because it is cheaper to do another request than burn function hours.  
I know there are mixed opinions on Theo, but I really do recommend his video on keeping costs down on serverless: 

## 5. Open Source is King

I devided to make this project open source, not out of the goodness of my heart, but so the code would be available to recruiters on my Github. This ended up being probably the best choice I made in this whole project.

### other people will do work for you, for free

Soon after I posted this project, and it started getting some traction on twitter, I saw a reply from @0xUltraInstinct "hey, I've added a Share on X button and made a PR". 

What?

Someone, a stranger, just added a feature to my website. This might have been the most surreal experience of the whole project. I chatted with @goku in dms, made a couple changes to his PR to fit the project better, and in minutes, not hours, this feature was added. Now users could copy the output image and post it on their Twitter. 

A day or two later @immunity put up an issue on the github, he wanted a feature to save the color palettes generated by the app. But he didn't just put up the issue, he implemented it himself. With just a little tinkering (because he could not access the database), this feature was added as well. @immunity also made some UI changes across the site, which made the whole thing look a lot snappier. 

After launch, I wasn't really planning on updating the site other than bug fixes, but because of these contributions, features were added with almost no effort from me. I will certainly be open sourcing all of my projects from now on. 

### github issues for user feedback

While most user feedback I got was from Twitter, I do want to say that there was a huge benefit gained from people reporting bugs and having discussions in the Github issues. This gave me a much more streamlined way of seeing what needs to be done on the project. 

### forkers

While having users is nice, one of the most fulfilling aspects of this project was seeing what people were able to do with my code. I've seen two really cool forks of this project, and I wanted to give them another shoutout here. @aert0_ made frontend-aura, although no longer active, which takes your twitter profile and generates a website. and @crodaar made [auroralized.com](https://auroralized.com), which takes your color palette and creates an AI-generated aurora. Definitely check those projects out, and open source your stuff!

## 6. A Double-Edged Sword



## 7. Make Money