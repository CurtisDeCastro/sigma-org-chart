# Org Chart Plugin

This project is an interactive Org Chart plugin that visualizes organizational structures using your data. It is designed to be user-friendly and customizable, allowing you to explore and understand your organization's hierarchy at a glance.

## How It Works

- **Data Driven**: The org chart is generated from your data source. Each entity (person, team, etc.) is represented as a node, and relationships (such as manager or parent) are visualized as connections.
- **Visual Representation**: Each node can display an icon or image, a label, and additional information such as position, area, or location.
- **Legend**: A legend at the bottom of the chart shows unique icons and their labels for easy reference.

## Using the Org Chart

1. **Load Your Data**: The plugin automatically loads data from the configured source. Make sure your data includes at least the following columns:
   - Name or ID
   - Parent ID (to define hierarchy)
   - Position or Role
   - Area or Department
   - Image URL (optional, for profile pictures or icons)
   - Image Label (optional, for legend)
   - Location (optional)

2. **Explore the Chart**:
   - The chart will render automatically based on your data.
   - You can visually explore the hierarchy, see reporting lines, and identify teams or departments.
   - Hover over nodes to see more details if available.

3. **Legend**:
   - At the bottom of the chart, a legend displays all unique icons/images used in the chart, along with their labels.
   - This helps you quickly identify roles, departments, or other categories represented by icons.

## Customization

- **Data Columns**: You can customize which columns are used for names, images, labels, etc., by configuring the plugin settings.
- **Appearance**: The chart and legend are styled for clarity, but you can further customize the look and feel via CSS.

## Getting Started

To use the plugin:

1. Install dependencies:
   ```
   yarn install
   ```
2. Start the development server:
   ```
   yarn start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the org chart in your browser.

3. Build for production:
   ```
   yarn build
   ```

## Troubleshooting

- If the chart does not display, check that your data source is correctly configured and includes the required columns.
- For further help, contact your administrator or refer to the plugin documentation.

---

Enjoy exploring your organization's structure with the Org Chart Plugin!
