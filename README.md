# Wow guilds API

Backend for wings-guild website

## Project Goals:

1. Member Profiles:
   - Allow guild members to create and customize their profiles.
   - Include details such as character name, class, race, level, and specialization.
   - Display character avatars and achievements.
2. Raid Progress Tracker:
   - Track the guild's progress in raid content.
   - Show which bosses have been defeated and which are still pending.
   - Include statistics on raid completion times and loot distribution.
3. Event Calendar:
   - Maintain a calendar of upcoming guild events, raids, and meetings.
   - Enable members to RSVP for events and receive notifications.
   - Allow officers to schedule and manage events.
4. Recruitment Center:
   - Provide a space for guild recruitment, specifying roles and classes needed.
   - Allow potential recruits to apply and submit their character information.
   - Facilitate communication between officers and applicants.
5. News and Announcements:
   - Share guild news, updates, and important announcements.
   - Highlight member achievements, promotions, and special events.
6. Media Gallery:
   - Allow members to upload and share screenshots, videos, and fan art related to WoW.
   - Categorize media by event, raid, or theme.
7. Guild Roster:
   - Display a comprehensive list of guild members and their characters.
   - Include sortable columns for character details, roles, and activity levels.
8. Progression History:
   - Maintain a historical record of the guild's raiding and PvP achievements.
   - Showcase the guild's growth and accomplishments over time.
9. Recruitment Logs:
   - Keep logs of recruitment activities, applications, and outcomes.
   - Assist officers in tracking and evaluating potential recruits.
10. Guides and Resources:
    - Relate guides and resources for raid strategies, class guides, and profession tips.
    - Allow members to contribute their own guides and share knowledge.
11. Integration with WoW API:
    - Integrate with the WoW API to automatically fetch and display character information.
    - Display in-game achievements, gear, and stats on member profiles.
12. Support for Addons:
    - Offer plugins or addons that enhance the website's functionality, such as Discord integration or loot tracking.
13. Analytics and Metrics:
    - Incorporate analytics tools to track website traffic and user engagement.
    - Use data to make informed decisions and improve the user experience.
14. Customization Options:
    - Allow guild leaders to customize the website's appearance and layout.
    - Support custom themes and banners.
15. Backup and Data Recovery:
    - Regularly back up website data to prevent data loss.
    - Have a data recovery plan in case of unexpected issues.
16. Feedback and Reporting:
    - Include a feedback mechanism for members to report issues or suggest improvements.
    - Ensure a responsive support system for addressing member concerns.

## Getting Started

1. clone the repository into the parent directory of your choice:

   `cd ~_dev`(My choice location)
   `git clone https://github.com/FullSol/wings-guild-api.git`

2. Move into the directory:

   `cd wings-guild-api`

3. Install packages:

   `npm install`

4. Initialize Sequelize-cli

   `sequelize init`

5. Updated database credentials

   ```
   Located in ./config/config.json
   {
     "development": {
       "username": "root",
       "password": null,
       "database": "database_development",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "test": {
       "username": "root",
       "password": null,
       "database": "database_test",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "production": {
       "username": "root",
       "password": null,
       "database": "database_production",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

6. Run migration and seed files with sequelize

   ```
   sequelize db:migrate
   sequelize db:seed:all
   ```

7. Checkout out a new branch
   `git checkout -B your-branch-name-here`

8. Start coding!

## Tech Stack

###Backend
NodeJS (ExpressJS)

#####Testing Suite:

1. Joi
1. Sinon
1. Chai
1. Supertest

###Frontend

React
