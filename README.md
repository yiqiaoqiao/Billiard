# README

# Billiard

### Step 1: Begin with these steps to repository setup:

Clone the repository from github and unzip the file.

### Step 2: Now follow these steps to run and modify your project:

> Before you start:
> 
> - The following steps is using a traditional way to complete the assignment.
> - It will work, but we will recommend you to use an IDE (**very strongly recommend**).
>     - See the chapter at the end of this article.
1. Go to your folder. The easiest way is to right click the popup (in your browser) that downloaded it, then choose `Show in Folder`. You should see following files listing in your opened folder.
    
    > Please refer to this folder as theRoot Folder for this Assignment, which containing an index.html.
    > 
2. You should see the file index.html in your folder. You can already try clicking that open to see the code run on your machine but in most cases, you can only see a blank page with title `Tiny Graphics`. That’s because the webpage is unable to load local files (scripts, texture images, sounds, models) out of your own file-system, due to its safety protections against your web browser.
3. Run a fake server, which lacks those security protections. Do this by opening the file we gave you called `host` - `host.bat` if you’re Windows, `host.command` if you’re Mac. On Windows you can just double click the file open.
    - Python is required for the fake server.
    - **On Mac, you might get a security warning instead if you double-click.** Instead, right click the files, then choose Open, or you can go into System Preferences/Security & Privacy/General and click ‘Open Anyway’. You may possibly need to check the file permissions and set them to 744.
    - On newer MacOS versions, you may even need to go to system preferences to allow the script to run. So you can also consider open a terminal at this folder and run `python server.py`.
4. Look in the resulting console window. If you can’t find a message starting with `Serving HTTP on ...`, your operating system might not have come with Python; go download and install that first – use Google for help on that, then try our files again.
5. Now you’re hosting. Keep that window open.
6. Open a new window of Google Chrome. Download it first if needed.
7. Navigate Chrome to the url [http://localhost:8000/](http://localhost:8000/) That assumes that step 5’s message said port 8000 - otherwise change the number in the URL to match.
8. Observe that your project shows up at this new URL. That’s where you’ll access it from now on.

Unfortunately, web developers in practice have to do that fake server thing pretty often to be able to work on their files locally. **Keep the .bat or .command program open while you work.**

---

### Using IDE

Here we will discuss how to use IDE WebStorm to complete the above steps in a much easier way. As UCLA students, we can use it for free (and many other IDEs from JetBrain brand). Check their official homepage for how to get a free licsence and install it: https://www.jetbrains.com/webstorm/

> Other IDEs are also fine, but we will take WebStorm as an example.
> 
> 
> VSCode is popular in recent days, and, though it is technically an editor rather than an IDE, it is powerful enough to help with the assignments as well, if you install the right extensions.
> 

First, complete the Step 1 and have an unzipped assignment root folder that contains `index.html`.

Then, open the WebStorm and choose `Open` (or in the menu bar: File / Open…) to open an existing project folder. Choose our assignment root folder

In the opened project view, we will first make correct running and debugging configurations, so the IDE can help us to run the server and reflect the changes on the go. You can edit the configurations and set every parameter as needed if you’re an exert of these kind of things. Or an easy way is as follows:

- Open the `index.html` in your IDE by double clicking the file on the Project Panel (list of files in left part of IDE), make sure you see the code in `index.html` in IDE.
- Choose menu bar action: Run / Run…
- A pop-up should show and click `index.html`.
- You should see a webpage opened in your default browser with expected colorful triangle in the above Step 2

Then, we can do modifications to the scripts. Open `assignment1.js` in the IDE and make the required editing as described in Step 6, and save the file (never forget to save everything before you want to see the effect of modification). Now, you should see the desired colorful rectangle in the previous webpage if you refresh it.

As you can feel, using an IDE is much more convenient. You should feel it more when it comes to debugging, which is something painful but we must overcome for software developing. Using an IDE will reduce this pain and that’s why we strongly recommend the class to use an IDE to complete the assignments as well as the team project.

There are so many resources from JetBrain and online discussions about how to master this IDE. Check this [site](https://www.jetbrains.com/webstorm/learn/) to learn more trick and tips about WebStorm.