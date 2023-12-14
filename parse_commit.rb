require 'open3'

# Function to parse a single commit block
def parse_commit(commit_block)
  lines = commit_block.split("\n")
  sha_line, author_line, date_line, *message_lines = lines

  {
    sha: sha_line.split[1],
    author: author_line.split(": ").last,
    merged_at: date_line.split(":   ").last,
    description: message_lines.reject(&:empty?).join("\n")
  }
end

# Function to run git log and parse the output
def git_log_commits(tag1, tag2)
  commits = []
  commit_block = ""
  in_commit_block = false

  Open3.popen3("git log #{tag1}..#{tag2}") do |stdin, stdout, stderr, wait_thr|
    stdout.each do |line|
      if line.start_with?("commit ")
        commits << parse_commit(commit_block) unless commit_block.empty?
        commit_block = line
        in_commit_block = true
      elsif in_commit_block
        commit_block += line
      end
    end
  end

  # Don't forget to parse the last commit block
  commits << parse_commit(commit_block) unless commit_block.empty?
  commits
end

# Example usage
tag1 = 'v1.9.0'
tag2 = 'v2.0.0'
commits = git_log_commits(tag1, tag2)
puts commits
