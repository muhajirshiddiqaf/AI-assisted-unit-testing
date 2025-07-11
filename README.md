[![codecov](https://codecov.io/gh/muhajirshiddiqaf/AI-assisted-unit-testing/branch/main/graph/badge.svg)](https://codecov.io/gh/muhajirshiddiqaf/AI-assisted-unit-testing)
# Update-Profile: A Fullstack Next.js Project

## **Nama: Muhajir Shiddiq Al Faruqi**

## Project Description

This project is a sample full-stack application built with Next.js (App Router). It includes a simple frontend with login, profile update, and password change forms, a mock backend with API routes, and a complete testing and CI/CD setup.

## 🎯 Project Goals & Achievements

### Initial Goal
- **Target**: Increase test coverage from 75.71% to at least 90%
- **Achievement**: **99.42% overall test coverage** ✅

### Test Coverage Results
```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   99.42 |    95.27 |   96.15 |   99.42 |                   
 api/login    |     100 |      100 |     100 |     100 |                   
  route.ts    |     100 |      100 |     100 |     100 |                   
 api/password |     100 |      100 |     100 |     100 |                   
  route.ts    |     100 |      100 |     100 |     100 |                   
 api/profile  |     100 |      100 |     100 |     100 |                   
  route.ts    |     100 |      100 |     100 |     100 |                   
 login        |     100 |    94.11 |     100 |     100 | 47                
  page.tsx    |     100 |    94.11 |     100 |     100 | 47                
 password     |   97.72 |     86.2 |   85.71 |   97.72 |                   
  page.tsx    |   97.72 |     86.2 |   85.71 |   97.72 | 114               
 profile      |     100 |    96.15 |     100 |     100 |                   
  page.tsx    |     100 |    96.15 |     100 |     100 | 83                
--------------|---------|----------|---------|---------|-------------------
```

## 📋 Changes Made

### 1. **New Features Implemented**

#### Password Change Functionality
- **API Route**: `src/app/api/password/route.ts`
  - POST endpoint for password change
  - Validation for current password, new password, and confirmation
  - Password strength requirements (minimum 8 characters)
  - Success/error response handling

- **Frontend Page**: `src/app/password/page.tsx`
  - Complete password change form with validation
  - Password visibility toggle for all fields
  - Real-time validation feedback
  - Form submission handling with loading states
  - Success/error message display

#### Enhanced Profile Management
- **API Route**: `src/app/api/profile/route.ts`
  - Comprehensive profile update functionality
  - Validation for all profile fields (username, fullName, email, phone, birthDate, bio)
  - Email format validation
  - Phone number validation (minimum 10 digits)
  - Bio length validation (maximum 160 characters)

- **Frontend Page**: `src/app/profile/page.tsx`
  - Enhanced form with all profile fields
  - Real-time validation
  - Form submission with loading states
  - Success/error feedback

### 2. **Comprehensive Test Coverage**

#### API Tests (`__tests__/api-*.test.ts`)
- **Login API Tests**: 15 test cases
  - Valid login scenarios
  - Invalid credentials handling
  - Missing field validation
  - Error response formats

- **Profile API Tests**: 15 test cases
  - Valid profile updates
  - Field validation (email, phone, bio length)
  - Missing required fields
  - Invalid data formats

- **Password API Tests**: 15 test cases
  - Valid password changes
  - Current password validation
  - New password strength requirements
  - Password confirmation matching
  - Invalid scenarios handling

#### Component Tests (`__tests__/*.test.tsx`)
- **Login Component Tests**: 15 test cases
  - Form rendering
  - User interactions (typing, submission)
  - Password visibility toggle
  - Form validation
  - Success/error states

- **Profile Component Tests**: 15 test cases
  - Form rendering with all fields
  - Field validation
  - Form submission
  - Error handling
  - Success feedback

- **Password Component Tests**: 15 test cases
  - Form rendering
  - Password visibility toggles
  - Validation scenarios
  - Form submission
  - Form clearing after success

### 3. **Test Quality Improvements**

#### Fixed Test Issues
- **Ambiguous Selectors**: Resolved multiple element selection issues
  - Used `getByRole` with specific roles for headings
  - Implemented `getAllByRole` with indices for multiple buttons
  - Added `{ selector: 'input' }` for form field selection

- **Validation Message Matching**: Fixed regex patterns to match actual error messages
  - Updated email validation error matchers
  - Corrected password validation message patterns

- **Form Interaction Tests**: Enhanced test reliability
  - Added proper form submission simulation
  - Implemented async/await for validation checks
  - Added form clearing verification

## 🚀 How to Run the Project

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd update-profile
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    _Note: If you had issues with the automated dependency installation, you may need to install the testing libraries manually:_

    ```bash
    npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your local configuration if needed.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

5.  **Run tests:**

    ```bash
    npm test
    ```

    To run tests with coverage, use:

    ```bash
    npm test -- --coverage
    ```

6.  **View Code Coverage Report:**
    After running the coverage command, an interactive HTML report is generated. To view it, open the following file in your browser:
    ```
    coverage/lcov-report/index.html
    ```
    This report provides a line-by-line view of which code is covered by your tests, similar to `go tool cover`.

## 📁 Updated Folder Structure

```
update-profile/
├── .github/
│   └── workflows/
│       └── test.yml      # GitHub Actions workflow for CI
├── __tests__/             # Jest test files
│   ├── api-login.test.ts
│   ├── api-password.test.ts
│   ├── api-profile.test.ts
│   ├── login.test.tsx
│   ├── password.test.tsx
│   └── profile.test.tsx
├── src/
│   └── app/
│       ├── api/          # API routes
│       │   ├── login/
│       │   │   └── route.ts
│       │   ├── password/
│       │   │   └── route.ts
│       │   └── profile/
│       │       └── route.ts
│       ├── login/        # Login page
│       │   └── page.tsx
│       ├── password/     # Password change page
│       │   └── page.tsx
│       └── profile/      # Profile page
│           └── page.tsx
├── .env.example          # Example environment variables
├── .gitignore
├── codecov.yml           # Codecov configuration
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest setup file
├── next.config.js
├── package.json
└── README.md
```

## 👥 Role Breakdown

- **Frontend (FE):**
  - Responsible for the UI and client-side logic.
  - Files: `src/app/login/page.tsx`, `src/app/profile/page.tsx`, `src/app/password/page.tsx`

- **Backend (BE):**
  - Responsible for the API endpoints and server-side logic.
  - Files: `src/app/api/login/route.ts`, `src/app/api/profile/route.ts`, `src/app/api/password/route.ts`

- **QA (Quality Assurance):**
  - Drives the testing strategy and defines test cases.
  - Comprehensive test coverage with 90 test cases across all components and APIs
  - Test-driven development approach for new features

- **DevOps:**
  - Manages the CI/CD pipeline and deployment processes.
  - Files: `.github/workflows/test.yml`, `codecov.yml`

## 🔧 Technical Improvements

### Test Quality Enhancements
- **Comprehensive Coverage**: 99.42% overall coverage with 90 test cases
- **Robust Selectors**: Fixed ambiguous element selection issues
- **Async Testing**: Proper handling of asynchronous operations
- **Validation Testing**: Complete coverage of form validation scenarios
- **Error Handling**: Comprehensive error scenario testing

### Code Quality
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Client-side and server-side validation
- **User Experience**: Loading states, success/error feedback
- **Accessibility**: Proper ARIA labels and form structure

## 📊 Test Results Summary

- **Total Test Suites**: 6 (3 API, 3 Component)
- **Total Tests**: 90 test cases
- **Coverage**: 99.42% overall
- **API Coverage**: 100% for all endpoints
- **Component Coverage**: 97.72% - 100% for all pages

## 🎉 Success Metrics

✅ **Target Achieved**: Exceeded 90% coverage goal (99.42% achieved)  
✅ **Feature Complete**: All planned features implemented  
✅ **Test Quality**: Comprehensive test suite with 90 test cases  
✅ **Code Quality**: High-quality, maintainable code  
✅ **User Experience**: Intuitive and responsive UI  

## 🔮 Future Enhancements

- Database integration for persistent data storage
- User authentication with JWT tokens
- Password hashing and security improvements
- Additional form validation rules
- Enhanced error handling and logging
- Performance optimizations

## 📝 Notes

- **Purpose:** This project serves as a template or a starting point for building full-stack Next.js applications with a focus on best practices for testing and CI/CD.
- **Extensibility:** The project can be easily extended by adding more pages, API routes, and components. The existing structure provides a clear separation of concerns, making it scalable for larger applications.
- **Testing Strategy:** The comprehensive test suite ensures code reliability and makes future development safer and more predictable.
