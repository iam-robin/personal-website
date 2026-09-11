---
title: "notion budget"
description: "A React and Express app that reads a Notion budget database and turns personal finance data into charts."
thumbnail: "/projects/notionbudget.png"
tags: ["Data viz", "React", "Express"]
year: "2021"
bgColor: "#18181B"
---

![](../../assets/projects/notion-budget/002.png)

I tracked my private expenses in a [Notion](https://www.notion.so/personal) budget planner for over a year. When the official Notion API came out, I built a small React and Express app around that database, mostly to see my own spending patterns more clearly.

The data shown here is demo data. It does not reflect my real income or expenses.

### Data
I tracked all my expenses in Notion over a year to get a better overview of my finances. I distinguished between fixed costs and variable costs. Fixed costs, such as rent, electricity, Spotify and other digital subscriptions consist of a start date, the monthly cost and if canceled an end date. Variable costs such as food, clothes, leisure activities were entered manually with the amount of the expense and a label for categorization. Also included in the table are my fixed and variable incomes for each month.

![](../../assets/projects/notion-budget/exampledata.png)

### Application
In order to better evaluate the accumulated data, to recognize patterns and, in the best case, to better invest my money by adjusting my consumption behavior, I took the chance with the release of the official Notion API and built a small web application that visualizes exactly this data for me. The application is divided into two sections. The monthly and annual overview. In the monthly view, you can navigate between individual months. On the one hand, the total amount of money is displayed, which I have saved in this month and on the other hand an overview of how I spent the money. In the annual overview, the individual months can be compared with each other and average values for the categories are calculated to get a better overall feel for the data.

![](../../assets/projects/notion-budget/screen1.png)

![](../../assets/projects/notion-budget/screen2.png)

[https://github.com/iam-robin/notion-budget-planner](https://github.com/iam-robin/notion-budget-planner)
