# Project Tracker

## Note
- This is a App router nextjs application keep that in mind.

## TODO Comments
- [x] Add functionality to edit project details
- [x] Implement project deletion with confirmation dialog
- [x] Enhance project search with filters and sorting options
- [x] Implement an invitation system for team leaders to invite users to their teams.
- [x] Add invitation functionality to the UnteamedUsersList.
- [x] Create a component to manage received invitations.
- [ ] Optimize the entire codebase for server-side rendering (SSR).
- [ ] Ensure sensitive credentials are hidden on the server side.
- [ ] Secure Firebase initialization using environment variables.
- [ ] Optimize components for SSR by avoiding client-side hooks in server-rendered components.
- [ ] Ensure the `.env.local` file contains necessary environment variables for Firebase.
- [ ] Consider additional features or enhancements to improve the platform.
  - Home page can be better especially for new users who are not logged in. Consider adding more engaging visuals or content to improve the user experience.
  - Implement user profiles with editable display names and avatars.
  - Show user avatar with partially hidden email (e.g., alexl******om) on login.
  - Ensure every Project and Team data type has its owner's Firebase Auth ID for deletion permissions.

### UI Enhancements for Unauthenticated Users:
- [x] Add a detailed welcome message explaining the platform's benefits.
- [x] Include a section highlighting key features of the platform.
- [x] Provide a more prominent call to action for signing up or logging in.
- [x] Use engaging visuals or animations to enhance the page's appeal.

## Feature Comments:
- Project creation and listing are implemented.
- Team management within projects is functional.
- Join requests and invitations are integrated with real-time updates.
- Authentication and conditional rendering based on user status are in place.

## Next Steps
- Ensure all UI components are styled consistently and responsively.
- Add any missing UI components or dialogs for a complete user experience.
- Conduct thorough testing to identify and fix any bugs or issues.
- Ensure all features work seamlessly across different devices and browsers.
- Finalize deployment settings and configurations on Vercel.
- Ensure environment variables are correctly set up for production.
- Create comprehensive documentation for developers and users.
- Include setup instructions, feature descriptions, and usage guidelines.
- Consider any additional features or enhancements that could improve the platform, such as user profiles, notifications, or analytics.

## UI Consistency and Responsiveness
- Review and update styles for consistent and responsive design across all components.

## User Profiles
- Implement user profiles with editable display names and avatars.

## Home Page Improvements
- Enhance the home page for unauthenticated users with engaging visuals and content.

## Analytics
- Add analytics to track user engagement and platform usage.

## Testing and Debugging
- Test the application on different devices and browsers to ensure responsiveness and functionality.
- Debug any issues that arise during testing.

## Deployment
- Prepare the application for deployment on Vercel.
- Verify all deployment settings and configurations.

## Documentation
- Update documentation with setup instructions, feature descriptions, and usage guidelines.

## Additional Features
- Consider implementing user profiles with editable display names and avatars.
- Show user avatar with partially hidden email (e.g., alexl******om) on login.
- Add analytics to track user engagement and platform usage.