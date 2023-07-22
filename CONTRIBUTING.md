# Contributing to `react-declarative`

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

## Installing the correct versions of Node, NPM and necessary dependencies

To build this software unix-like shell required. WSL on Windows is good enough. I am using `OSX 10.15` and `Ubuntu 22.04`.

### NodeJS

```bash
user@MacBook-Air-user ~ % node --version
v16.9.1
```

### NPM

```bash
user@MacBook-Air-user ~ % npm --version
7.21.1
```

## Commands

### Start demo project with latest changes from src folder

```bash
npm install # only first time
npm run build
cd demo
npm install # after every "npm run build"
npm start
```

## Code Structure

Currently, the [source](https://github.com/react-declarative/react-declarative) is split up into a two categories:

- [demo](https://github.com/react-declarative/react-declarative/tree/master/demo): the test project
- [soruce](https://github.com/react-declarative/react-declarative/tree/master/source): the source code 

## Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and has been resolved, or the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. Having a reproducible scenario gives us wealth of important information without going back and forth with you requiring additional information

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We will be insisting on a minimal reproduction in order to save maintainers' time and ultimately be able to fix more bugs. Interestingly, from our experience, users often find coding problems themselves while preparing a minimal reproduction repository. We understand that sometimes it might be hard to extract essentials bits of code from a larger codebase, but we really need to isolate the problem before we can fix it.

### <a name="submit-pr"></a> Submitting a PR

This project follows [GitHub's standard forking model](https://guides.github.com/activities/forking/). Please fork the project to submit pull requests.
