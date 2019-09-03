# `alwaysai` [![Build Status](https://travis-ci.com/alwaysai/cli.svg?branch=master)](https://travis-ci.com/alwaysai/cli)
The [alwaysAI](https://alwaysai.co) command-line interface (CLI)

## Prerequisites
### Node.js

Node.js is an open-source cross-platform JavaScript run-time environment. To check if your development computer has Node.js installed already, open a terminal and enter

```
$ node --version
```

This should print a version string like v12.5.0. The alwaysAI CLI requires Node.js v8.0.0 or greater. Node.js ships with npm, a package manager that we’ll use to install the alwaysAI CLI.

To install Node.js, visit [https://nodejs.org/](https://nodejs.org/) in a browser and follow the instructions for your operating system.

### OpenSSH

OpenSSH is a suite of secure networking utilities based on the Secure Shell (SSH) protocol. The alwaysAI CLI relies on OpenSSH for connecting to your edge device and related tasks like key generation. To check if your computer has OpenSSH installed already, open a terminal and enter

```
$ ssh -V
```

This should print a version string like OpenSSH_7.9p1, LibreSSL 2.7.3. MacOS and most Linux distributions already have OpenSSH installed out of the box, and as of late 2018, Windows 10 does too! Check out this article on the Microsoft docs site for more information on installing OpenSSH on Windows.

## Install the CLI

To install the alwaysAI CLI, in a terminal on your development machine enter

```
$ npm install --global alwaysai
```

If you encounter an error “EACCES: permission denied”, you’ll need to run that command with administrative privileges as

```
$ sudo npm install --global alwaysai
```

Enter your user’s operating system password when prompted.

To verify that the alwaysAI CLI is fully installed and accessible run

```
$ alwaysai -v
```

This should print a version string like 0.1.2.

## More information
You can read the full documentation for the alwaysAI platform at [https://dashboard.alwaysai.co/docs/introduction/welcome.html](https://dashboard.alwaysai.co/docs/introduction/welcome.html). If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on this project's repository on GitHub.

## License
MIT © [alwaysAI, Inc.](https://alwaysai.co)
