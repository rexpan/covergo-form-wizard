### [See the welcome video first](https://www.loom.com/share/4ea99299854f433fb98999d23211bf5b)

# Basics

*   You will work on it at home and at your own pace
*   To increase your chances, try to upload the results in next 1-3 days
*   This exercise usually takes 2-4 hours to complete

# What we are building?

*   We are building a multi-step form (wizard) where user can fill in information, get price and buy an insurance policy
*   **Wireframes** are in [Miro](https://miro.com/app/board/o9J_laOKpgA=/?invite_link_id=541065843186)

# Preparation

*   Use Vue (2/3) if you are familiar with it OR any framework you prefer
*   You can use Typescript
*   Do not use any component library like bootstrap etc. We want to see how you work with bare html
*   Use Tailwind if you're familiar with it, you can use vanilla CSS as well

# Requirements:

See in [Miro](https://miro.com/app/board/o9J_laOKpgA=/?invite_link_id=541065843186)

## Page 1

*   The first page is a welcome screen
*   User can click on the `Start` button and the wizard would start

## Page 2

*   We need to collect:
    *   `name`
    *   `age`
    *   `country` (user can select only one of:)
        *   `Hong Kong`
        *   `USA`
        *   `Australia`

*   Each country will represent particular currency so that the user can see calculated premium with proper currency. It will be important on the next step where we do premium calculation
    *   `Hong Kong` : `HKD`
    *   `USA` : `USD`
    *   `Australia` : `AUD`

*   User has to choose which `Package` they want, only one of:
    *   `Standard`
    *   `Safe` (it is 50% more expensive than Standard), it should show how much more user has to pay in the selected currency
    *   `Super Safe` (it is 75% more expensive than Standard), it should show how much more user has to pay in the selected currency

*   On this page, user can also see calculated `Premium` in correct currency
    *   Formula for the premium is `10 * Age`
    *   Based on the selected country, premium will be adjusted accordingly based on the rate `10 * Age * Rate`

| **Currency Code** | **Rate** | **Example** |
|-------------------|---------:|------------:|
| HKD               | 1        | 100HKD      |
| USD               | 2        | 200USD      |
| AUD               | 3        | 300AUD      |

*   Based on the selected `Package`, premium will be adjusted accordingly, see `Package` options
*   If user `age` is over 100, we direct him to `Page 2 - age error` when clicking on `Next` button
*   Otherwise user can go step back or to the next page

## Page 2 - age error

*   If user clicks on the button, he will be redirected to the Page 1

## Page 3

*   The final step of the journey where user can see the summary and proceed to buy
*   Buy button lead to Page 1

* * *

# What is not allowed

*   You should not copy big chunks of code from the internet

# What is important

*   Focus on functionality, **styling is secondary** (better to have the wizard working and ugly than not working and beautiful). No need to have pixel-perfect design as Miro provides only wireframe
*   Proper behaviour of the wizard
*   Proper behaviour of the premium calculation
*   Organisation of code

# What is not important

*   SEO (meta tags and other SEO concerns)
*   To support all browsers, we are ok with latest chromium-based browser

# What will make you stand out

*   If you think about the UX of this wizard thoroughly
*   If you use new features beyond ES2015
*   Eye for design, how well you are able to style this wizard on your own (without a designer or UI mock) using either Tailwind css or vanilla css
*   Including tests

# Expected outputs

1.  Github repository with the full solution
2.  One-pager `solution.md` explaining technical choices, architecture and the approach
3.  [Optional] Demo video walking us through the solution and code (you get plus points)

# How to submit

*   After you're done, please push your code to GitHub and send the repo URL to HR/Recruiter (normally there will be a HR person who is in touch with you)
