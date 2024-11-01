#!/bin/bash

# Variables
START_DATE="2024-01-01"
END_DATE="2024-10-25"
BRANCH="main"

# Convert dates to seconds (macOS/BSD compatible)
start_seconds=$(date -j -f "%Y-%m-%d" "$START_DATE" +%s)
end_seconds=$(date -j -f "%Y-%m-%d" "$END_DATE" +%s)

# Function to check if a date falls on a weekend
is_weekend() {
    day_of_week=$(date -j -f "%s" "$1" "+%u")
    if [[ "$day_of_week" -gt 5 ]]; then
        return 0  # It's a weekend (Saturday or Sunday)
    else
        return 1  # It's a weekday
    fi
}

# Function to decide if we should commit on this weekend
should_commit_this_weekend() {
    # Generate a random number between 0 and 1 (50% chance of committing)
    return $(( RANDOM % 2 ))
}

# Loop through each date from START_DATE to END_DATE
for ((current_seconds=start_seconds; current_seconds<=end_seconds; current_seconds+=86400)); do
    # Convert seconds back to date format (macOS/BSD compatible)
    current_date=$(date -j -f "%s" "$current_seconds" "+%Y-%m-%d")
    
    # Only proceed if it's a weekend
    if is_weekend "$current_seconds"; then
        # Randomly decide if we commit this weekend (50% chance)
        if should_commit_this_weekend; then
            # Generate a random number of commits for weekends (between 1 and 3)
            num_commits=$(( ( RANDOM % 3 ) + 1 ))
            echo "Random Weekend: $current_date, committing $num_commits times."
            
            # Make the commits
            for ((i=1; i<=num_commits; i++)); do
                # Step 1: Modify the README.md file with a unique entry
                echo "Update $i for $current_date" >> README.md
                
                # Step 2: Add the file to the staging area
                git add README.md
                
                # Step 3: Commit the changes with a custom commit date (with commit and author date set)
                GIT_COMMITTER_DATE="$current_date 12:00:00" git commit --date="$current_date 12:00:00" -m "Commit $i for $current_date"
                
                echo "Committed $i for $current_date."
            done
            
            # Step 4: Push the changes after all commits for this date
            git push origin "$BRANCH"
            
            echo "Pushed $num_commits commits for $current_date."
        else
            echo "Skipping random weekend: $current_date"
        fi
    else
        echo "Skipping weekday: $current_date"
    fi
done

echo "All random weekend updates from $START_DATE to $END_DATE have been committed and pushed."
