# Mockup of a UI for visualizing a dataset that backs possible parameter values

One of the cool features of [Project Drawdown Modeling Engine](https://github.com/ProjectDrawdown/solutions) is that paramaters don't exist in a vacuum: for each scalar parameter there is a '*Variable Meta-Analysis*', aka 'VMA', that lists relevant values or estimates for that parameter from other sources.  That way, when you want to estimate, for example, the cost of building a kilometer of bike path, you can base your estimate on other existing estimates, generally made by folks who know what they are talking about.

The current interfaces (Python and Excel) don't do a very good job of exposing this information to users, however.  Generally you have the option to select the median value, but if you don't understand the backing dataset, that isn't very meaningful.  Nor does it give you any sense of how broad the range is, or why the estimates might differ from one another...

So this is a little mini-project to show what I think such a user interface might look like.  I'm doing this implementation as a Vue component just to get some experience with Vue, but the choice of technology isn't critical.

# StackBlitz

I'm using StackBlitz to do this project (also an experiment).  See it on [StackBlitz ⚡️](https://stackblitz.com/edit/vitejs-vite-iyg4cg)