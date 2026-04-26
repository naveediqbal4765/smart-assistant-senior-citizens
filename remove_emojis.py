#!/usr/bin/env python3
import os
import re
import glob

# Emoji pattern - matches most common emojis
emoji_pattern = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F680-\U0001F6FF"  # transport & map symbols
    "\U0001F1E0-\U0001F1FF"  # flags (iOS)
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "\U0001f926-\U0001f937"
    "\U00010000-\U0010ffff"
    "\u2640-\u2642"
    "\u2600-\u2B55"
    "\u200d"
    "\u23cf"
    "\u23e9"
    "\u231a"
    "\ufe0f"  # dingbats
    "\u3030"
    "]+",
    flags=re.UNICODE
)

# Emoji replacements - map emoji to text
emoji_replacements = {
    "🏠": "[Home]",
    "💬": "[Messages]",
    "📋": "[Tasks]",
    "🔐": "[Lock]",
    "👤": "[User]",
    "⚙️": "[Settings]",
    "🚪": "[Logout]",
    "❤️": "[Heart]",
    "🫁": "[Lungs]",
    "🌡️": "[Temperature]",
    "💊": "[Medication]",
    "📄": "[Document]",
    "📊": "[Chart]",
    "🚗": "[Car]",
    "🎤": "[Microphone]",
    "🚕": "[Taxi]",
    "👥": "[People]",
    "🎵": "[Music]",
    "⏰": "[Clock]",
    "💪": "[Strength]",
    "📞": "[Phone]",
    "ℹ️": "[Info]",
    "🛡️": "[Shield]",
    "🏥": "[Hospital]",
    "🔔": "[Bell]",
    "✅": "[Check]",
    "❌": "[Cross]",
    "⚠️": "[Warning]",
    "🔍": "[Search]",
    "➕": "[Plus]",
    "➖": "[Minus]",
    "🔄": "[Refresh]",
    "💾": "[Save]",
    "🗑️": "[Delete]",
    "📱": "[Mobile]",
    "💻": "[Computer]",
    "🌐": "[Web]",
    "📧": "[Email]",
    "📨": "[Mail]",
    "⚕️": "[Medical]",
    "📃": "[Page]",
    "📈": "[Up]",
    "📉": "[Down]",
    "📑": "[Pages]",
    "🗂️": "[Folder]",
    "🗃️": "[Cabinet]",
    "🕐": "[Time]",
    "📅": "[Calendar]",
    "📆": "[Date]",
    "⏱️": "[Timer]",
    "⏲️": "[Stopwatch]",
    "🎬": "[Film]",
    "🎭": "[Theater]",
    "🎨": "[Art]",
    "🎯": "[Target]",
    "🚨": "[Alert]",
    "🆘": "[SOS]",
    "🚑": "[Ambulance]",
    "❓": "[Question]",
    "💡": "[Idea]",
    "🌟": "[Star]",
    "✨": "[Sparkle]",
    "🎁": "[Gift]",
    "🎉": "[Celebration]",
    "⏳": "[Loading]",
    "📷": "[Camera]",
    "✓": "[Check]",
    "⏱": "[Hourglass]",
}

def remove_emojis_from_file(filepath):
    """Remove emojis from a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace specific emojis first
        for emoji, replacement in emoji_replacements.items():
            content = content.replace(emoji, replacement)
        
        # Remove any remaining emojis
        content = emoji_pattern.sub('', content)
        
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
    """Main function to process all JS files"""
    src_dir = '/workspace/frontend/src'
    
    # Find all JS/JSX files
    js_files = glob.glob(f'{src_dir}/**/*.js', recursive=True)
    js_files += glob.glob(f'{src_dir}/**/*.jsx', recursive=True)
    
    print(f"Found {len(js_files)} JS/JSX files")
    print("Removing emojis...\n")
    
    updated_count = 0
    for filepath in js_files:
        if remove_emojis_from_file(filepath):
            relative_path = filepath.replace('/workspace/frontend/src/', '')
            print(f"✓ Updated: {relative_path}")
            updated_count += 1
    
    print(f"\n✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
