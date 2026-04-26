#!/usr/bin/env python3
import os
import re
import glob

# Bracket replacements - map [text] to clean text
bracket_replacements = {
    "[Home]": "Home",
    "[Messages]": "Messages",
    "[Tasks]": "Tasks",
    "[Lock]": "Lock",
    "[User]": "User",
    "[Settings]": "Settings",
    "[Logout]": "Logout",
    "[Heart]": "Heart",
    "[Lungs]": "Lungs",
    "[Temperature]": "Temperature",
    "[Medication]": "Medication",
    "[Document]": "Document",
    "[Chart]": "Chart",
    "[Car]": "Car",
    "[Microphone]": "Microphone",
    "[Taxi]": "Taxi",
    "[People]": "People",
    "[Music]": "Music",
    "[Clock]": "Clock",
    "[Strength]": "Strength",
    "[Phone]": "Phone",
    "[Info]": "Info",
    "[Shield]": "Shield",
    "[Hospital]": "Hospital",
    "[Bell]": "Bell",
    "[Check]": "Check",
    "[Cross]": "Cross",
    "[Warning]": "Warning",
    "[Search]": "Search",
    "[Plus]": "Plus",
    "[Minus]": "Minus",
    "[Refresh]": "Refresh",
    "[Save]": "Save",
    "[Delete]": "Delete",
    "[Mobile]": "Mobile",
    "[Computer]": "Computer",
    "[Web]": "Web",
    "[Email]": "Email",
    "[Mail]": "Mail",
    "[Medical]": "Medical",
    "[Page]": "Page",
    "[Up]": "Up",
    "[Down]": "Down",
    "[Pages]": "Pages",
    "[Folder]": "Folder",
    "[Cabinet]": "Cabinet",
    "[Time]": "Time",
    "[Calendar]": "Calendar",
    "[Date]": "Date",
    "[Timer]": "Timer",
    "[Stopwatch]": "Stopwatch",
    "[Film]": "Film",
    "[Theater]": "Theater",
    "[Art]": "Art",
    "[Target]": "Target",
    "[Alert]": "Alert",
    "[SOS]": "SOS",
    "[Ambulance]": "Ambulance",
    "[Question]": "Question",
    "[Idea]": "Idea",
    "[Star]": "Star",
    "[Sparkle]": "Sparkle",
    "[Gift]": "Gift",
    "[Celebration]": "Celebration",
    "[Loading]": "Loading",
    "[Camera]": "Camera",
    "[!]": "!",
    "[Hourglass]": "Hourglass",
}

def clean_brackets_from_file(filepath):
    """Remove brackets from a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all bracket text
        for bracket_text, clean_text in bracket_replacements.items():
            content = content.replace(bracket_text, clean_text)
        
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
    print("Removing brackets...\n")
    
    updated_count = 0
    for filepath in files:
        if clean_brackets_from_file(filepath):
            relative_path = filepath.replace('/workspace/frontend/src/', '')
            print(f"✓ Updated: {relative_path}")
            updated_count += 1
    
    print(f"\n✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
