#!/usr/bin/env python3
import os
import re
import glob

# Text labels to remove
text_labels = [
    "Home",
    "Messages",
    "Tasks",
    "Lock",
    "User",
    "Settings",
    "Logout",
    "Heart",
    "Lungs",
    "Temperature",
    "Medication",
    "Document",
    "Chart",
    "Car",
    "Microphone",
    "Taxi",
    "People",
    "Music",
    "Clock",
    "Strength",
    "Phone",
    "Info",
    "Shield",
    "Hospital",
    "Bell",
    "Check",
    "Cross",
    "Warning",
    "Search",
    "Plus",
    "Minus",
    "Refresh",
    "Save",
    "Delete",
    "Mobile",
    "Computer",
    "Web",
    "Email",
    "Mail",
    "Medical",
    "Page",
    "Up",
    "Down",
    "Pages",
    "Folder",
    "Cabinet",
    "Time",
    "Calendar",
    "Date",
    "Timer",
    "Stopwatch",
    "Film",
    "Theater",
    "Art",
    "Target",
    "Alert",
    "SOS",
    "Ambulance",
    "Question",
    "Idea",
    "Star",
    "Sparkle",
    "Gift",
    "Celebration",
    "Loading",
    "Camera",
    "Hourglass",
]

def remove_text_labels_from_file(filepath):
    """Remove text labels from a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove text labels - be careful with context
        for label in text_labels:
            # Pattern: remove label when it's standalone text (not part of variable names)
            # This handles cases like: "Home", 'Home', >Home<, etc.
            patterns = [
                f'"{label}"',  # "Home"
                f"'{label}'",  # 'Home'
                f'>{label}<',  # >Home<
                f' {label} ',  # space Home space
                f'({label})',  # (Home)
                f'{label},',   # Home,
                f'{label}.',   # Home.
            ]
            
            for pattern in patterns:
                if pattern in content:
                    content = content.replace(pattern, '')
        
        # Clean up extra spaces and empty strings
        content = re.sub(r'"\s*"', '""', content)  # "" with spaces
        content = re.sub(r"'\s*'", "''", content)  # '' with spaces
        content = re.sub(r'>\s*<', '><', content)  # >< with spaces
        
        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all JS/CSS files"""
    src_dir = '/workspace/frontend/src'
    
    # Find all JS/JSX/CSS files
    files = glob.glob(f'{src_dir}/**/*.js', recursive=True)
    files += glob.glob(f'{src_dir}/**/*.jsx', recursive=True)
    files += glob.glob(f'{src_dir}/**/*.css', recursive=True)
    
    print(f"Found {len(files)} files")
    print("Removing text labels...\n")
    
    updated_count = 0
    for filepath in files:
        if remove_text_labels_from_file(filepath):
            relative_path = filepath.replace('/workspace/frontend/src/', '')
            print(f"✓ Updated: {relative_path}")
            updated_count += 1
    
    print(f"\n✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
