#!/usr/bin/env python3
import os
import re
import glob

def replace_svg_logo_with_png(filepath):
    """Replace SVG AppLogo with Logo.png image"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to match the entire AppLogo SVG component definition
        svg_pattern = r'const AppLogo = \(\{ size = 80 \}\) => \(\s*<svg[^>]*>.*?</svg>\s*\);'
        
        # Check if this pattern exists
        if re.search(svg_pattern, content, re.DOTALL):
            # Remove the AppLogo component definition
            content = re.sub(svg_pattern, '', content, flags=re.DOTALL)
            
            # Replace <AppLogo size={...} /> with <img src={Logo} alt="Logo" style={{...}} />
            # Pattern 1: <AppLogo size={Math.min(Math.max(32, window.innerWidth * 0.04), 48)} />
            content = re.sub(
                r'<AppLogo size=\{Math\.min\(Math\.max\(32, window\.innerWidth \* 0\.04\), 48\)\} />',
                '<img src={Logo} alt="Logo" style={{ height: Math.min(Math.max(32, window.innerWidth * 0.04), 48), width: \'auto\' }} />',
                content
            )
            
            # Pattern 2: <AppLogo size={80} />
            content = re.sub(
                r'<AppLogo size=\{80\} />',
                '<img src={Logo} alt="Logo" style={{ height: 80, width: \'auto\' }} />',
                content
            )
            
            # Pattern 3: <AppLogo size={...} /> (generic)
            content = re.sub(
                r'<AppLogo size=\{([^}]+)\} />',
                r'<img src={Logo} alt="Logo" style={{ height: \1, width: \'auto\' }} />',
                content
            )
            
            # Make sure Logo is imported
            if 'import Logo from' not in content:
                # Find the last import statement and add Logo import after it
                import_match = list(re.finditer(r"import .* from ['\"].*['\"];", content))
                if import_match:
                    last_import = import_match[-1]
                    insert_pos = last_import.end()
                    content = content[:insert_pos] + '\nimport Logo from "../../assets/images/Logo.png";' + content[insert_pos:]
        
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
    files = glob.glob(f'{src_dir}/**/*.js', recursive=True)
    files += glob.glob(f'{src_dir}/**/*.jsx', recursive=True)
    
    print(f"Found {len(files)} files")
    print("Replacing SVG logos with Logo.png...\n")
    
    updated_count = 0
    for filepath in files:
        if replace_svg_logo_with_png(filepath):
            relative_path = filepath.replace('/workspace/frontend/src/', '')
            print(f"✓ Updated: {relative_path}")
            updated_count += 1
    
    print(f"\n✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
