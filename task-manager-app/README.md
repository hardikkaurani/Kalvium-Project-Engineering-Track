# Task Manager App 📝

A simple, clean, and beginner-friendly task management web application built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **Add Tasks** - Create new tasks with a simple input  
✅ **Toggle Completion** - Mark tasks as done with a checkbox  
✅ **Filter Tasks** - View All, Active, or Completed tasks  
✅ **Delete Tasks** - Remove tasks with one click  
✅ **Local Storage** - Tasks persist even after page refresh  
✅ **Live Statistics** - See active and completed task count  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Project Structure

```
task-manager-app/
├── index.html      # HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Task logic and DOM manipulation
└── README.md       # This file
```

## How to Use

1. **Open the app**: Double-click `index.html` or open it in a web browser
2. **Add a task**: Type in the input box and click "Add Task" or press Enter
3. **Mark complete**: Click the checkbox next to a task to mark it done
4. **Delete task**: Click the "Delete" button to remove a task
5. **Filter tasks**: Use the "All", "Active", "Completed" buttons to filter

## Code Structure

### HTML (`index.html`)
- Clean semantic structure
- Input section for adding tasks
- Filter buttons section
- Task list container
- Stats footer

### CSS (`style.css`)
- Modern gradient background
- Smooth animations and transitions
- Completed tasks styled with line-through
- Mobile-responsive design
- Clean card-based layout

### JavaScript (`script.js`)
- **State Management**: Tasks stored in array + localStorage
- **Core Functions**:
  - `addTask()` - Add new task
  - `toggleTask()` - Mark task complete/incomplete
  - `deleteTask()` - Remove task
  - `getFilteredTasks()` - Apply filter logic
  - `render()` - Update entire UI
  - `createTaskElement()` - Create task DOM element

## Key Features Explained

### Local Storage
Tasks are automatically saved to browser's localStorage. Refresh the page and your tasks remain.

```javascript
saveTasks(); // Saves to localStorage
JSON.parse(localStorage.getItem('tasks')); // Loads on page load
```

### Filtering
Three filter states: `all`, `active`, `completed`
- Clicking filter buttons updates `currentFilter` and re-renders
- Only filtered tasks are displayed without losing data

### Events
- **Enter key**: Add task when pressing Enter in input
- **Checkbox change**: Toggle task completion
- **Delete button**: Remove task
- **Filter buttons**: Switch between views

## Browser Compatibility

Works in all modern browsers:
- Chrome / Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Future Enhancements

- 🎨 Dark mode toggle
- 📅 Task due dates
- 🏷️ Task categories/tags
- 🔔 Notifications
- 📊 Progress visualization
- ✏️ Edit existing tasks

## Getting Started

### Quick Start
```bash
# No setup needed! Just open index.html in your browser
```

### For Developers
```javascript
// Add custom styling
// Modify colors in style.css

// Add new features
// Extend functions in script.js

// Change filter categories
// Update filter buttons in HTML and filter logic in JS
```

## Code Quality

✨ **Clean & Readable**: Well-commented, small focused functions  
🎯 **Modular**: Each function has a single responsibility  
⚡ **Performant**: Minimal DOM updates using render() function  
♿ **Accessible**: Semantic HTML with ARIA labels  

## License

Free to use and modify for learning purposes.

---

**Built with ❤️ for beginners** - No frameworks, just vanilla JavaScript!
