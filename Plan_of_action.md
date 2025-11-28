# HostelCare – Development Action Plan

## 1. Technical Stack Strategy
To keep the focus on React Native UI/UX and minimize backend maintenance, we will use the following stack:

* **Frontend:** React Native (using Expo).
    * *Why Expo?* It is the fastest way to build, test, and deploy React Native apps without messing with native iOS/Android code.
* **Backend & Database:** Firebase (by Google) OR Supabase.
    * *Recommendation:* **Firebase**. It is incredibly "friendly" for React Native. It handles:
        * **Authentication:** Login/Signup for Students vs. Wardens.
        * **Firestore Database:** Real-time data syncing (great for status updates).
        * **Storage:** Storing the photos students upload with complaints.
* **UI Library:** React Native Paper or NativeBase.
    * *Why?* Pre-built components (Cards, Buttons, Chips for filters) make the app look "friendly" and professional immediately.

---

## 2. Phase-by-Phase Execution

### Phase 1: Setup & Authentication (The Foundation)
**Goal:** Get the app running and distinguish between a Student and a Warden.

* **Initialize Expo Project:** Set up the folder structure.
* **Firebase Integration:** Connect the app to a free Firebase project.
* **Auth Screens:**
    * Create a clean Login/Signup Screen.
    * **Role Logic:** When a user signs up, ask: *"Are you a Student or Staff?"* (Or pre-assign emails manually for Wardens for security).
* **Navigation:**
    * Set up React Navigation.
    * Create two separate distinct flows (Tab Navigators):
        1.  **StudentTabs** (Home, My Complaints, Profile)
        2.  **WardenTabs** (Dashboard, Manage, Profile)

### Phase 2: The "Student" Core Loop
**Goal:** Allow a student to report an issue effectively.

* **Complaint Form:**
    * **Inputs:** Title, Description, Room Number.
    * **Category Selector:** Chips or Dropdown for Electricity, Water, etc.
    * **Image Picker:** Integrate `expo-image-picker` to allow uploading a photo of the issue.
* **Submission Logic:** Write the data to Firestore with status default set to `Submitted`.
* **Student Dashboard:**
    * A list view showing their complaints.
    * Visual badges for status (Yellow for `In Progress`, Green for `Resolved`).

### Phase 3: The "Warden" Core Loop
**Goal:** Give the warden control over the chaos.

* **Master Feed:** A list fetching all complaints from the database.
* **Filter Logic:**
    * Add a horizontal scroll bar at the top with filter chips: *All, Pending, Resolved, Electricity, Floor 1*.
* **Action Modal:**
    * Clicking a complaint opens details.
    * **Status Changer:** A simple dropdown to change `Submitted` → `In Progress` → `Resolved`.
    * **Assign Staff:** A text field or dropdown to tag a staff member.

### Phase 4: Social & Engagement Features
**Goal:** Reduce duplicate complaints and improve communication.

* **Public Feed (for Students):** Allow students to see non-sensitive complaints from others.
* **Upvoting System:** Add a simple counter/heart icon. If 10 students upvote "No Internet", the Warden sees it at the top.
* **Comments:** Add a chat-like section inside the Complaint Details screen for **Warden ↔ Student** communication.

### Phase 5: Analytics & Polish
**Goal:** The "Insights" requirement.

* **Charts:** Use `react-native-chart-kit` for the Warden Dashboard.
    * **Pie Chart:** Issues by Category.
    * **Bar Chart:** Resolved vs. Pending this week.
* **Archiving:** A simple script or button to hide "Resolved" tickets older than 30 days.

---

## 3. Data Structure (Mental Model)
To keep it simple, our Database (Firestore) will look roughly like this:

### Collection: `users`
```json
{
  "uid": "12345",
  "name": "John Doe",
  "role": "student", // or "warden"
  "room": "B-304"
}