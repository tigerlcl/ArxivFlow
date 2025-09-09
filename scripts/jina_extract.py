import re
import json
# import requests


def extract_arxiv_papers(markdown_content, max_papers):
    """
    Extract paper information from arXiv search results in markdown format
    
    Args:
        markdown_content: Markdown content of arXiv search results
        max_papers: Maximum number of papers to extract
        
    Returns:
        List of dictionaries containing paper information
    """
    # Split the content by paper entries (each starts with a number followed by a period)
    paper_sections = re.split(r'\d+\.\s+\[arXiv:', markdown_content)
    
    # Remove the header section
    if paper_sections and not paper_sections[0].strip().startswith('[arXiv:'):
        paper_sections = paper_sections[1:]
    
    results = []
    
    # Process only the specified number of papers
    for i, section in enumerate(paper_sections):
        if i >= max_papers:
            break
            
        # Add back the arXiv prefix for proper parsing
        section = '[arXiv:' + section
        
        paper_data = {}
        
        # Extract paper ID and links
        id_match = re.search(r'\[arXiv:(\d+\.\d+)\]', section)
        if id_match:
            paper_id = id_match.group(1)
            paper_data['id'] = paper_id
            paper_data['link'] = f"https://arxiv.org/abs/{paper_id}"
            paper_data['pdf_link'] = f"https://arxiv.org/pdf/{paper_id}"
        
        # Extract title and category
        title_match = re.search(r'\n\s+(.*?)\n\s+Authors:', section, re.DOTALL)
        if title_match:
            title_text = title_match.group(1).strip()
            
            # Extract category if present (usually appears as cs.XX, math.XX, etc.)
            category_match = re.search(r'^((?:[a-z]+\.[A-Z]+\s*)+)\s*\n\s*(.*)', title_text, re.DOTALL)
            if category_match:
                # Extract categories (might be multiple)
                categories = category_match.group(1).strip().split()
                paper_data['categories'] = categories
                # Clean title is the second group
                paper_data['title'] = category_match.group(2).strip()
            else:
                # No category found, use the whole text as title
                paper_data['title'] = title_text
                paper_data['categories'] = []
        
        # Extract authors
        authors_match = re.search(r'Authors:(.*?)\n\s*Abstract:', section, re.DOTALL)
        if authors_match:
            # Extract author names from the links
            author_text = authors_match.group(1)
            # Find all author names within square brackets
            author_names = re.findall(r'\[(.*?)\]', author_text)
            paper_data['authors'] = author_names
        else:
            paper_data['authors'] = []
        
        # Extract abstract
        abstract_match = re.search(r'Abstract: (.*?)(?:\n\s+Submitted|\n\s+$)', section, re.DOTALL)
        if abstract_match:
            # Clean up the abstract text
            abstract = abstract_match.group(1).strip()
            
            # Handle the case where abstract contains both truncated and full versions
            # Pattern: "truncated text… [▽ More](link) full text [△ Less](link)"
            more_less_pattern = r'…\s*\[▽ More\]\([^)]+\)\s*(.*?)\s*\[△ Less\]\([^)]+\)'
            more_match = re.search(more_less_pattern, abstract, re.DOTALL)
            
            if more_match:
                # Extract the full text part (after "▽ More" and before "△ Less")
                abstract = more_match.group(1).strip()
            else:
                # If no "▽ More" pattern, just clean up any remaining "△ Less" text
                abstract = re.sub(r'\s*\[△ Less\]\([^)]+\)$', '', abstract).strip()
                # Also remove any remaining "▽ More" text
                abstract = re.sub(r'…\s*\[▽ More\]\([^)]+\).*$', '…', abstract, flags=re.DOTALL).strip()
            
            paper_data['abstract'] = abstract
        
        # Extract comments if present
        comments_match = re.search(r'Comments:\s*(.*?)(?:\n\s*(?:\d+\.|ACM Class:|$))', section, re.DOTALL)
        if comments_match:
            paper_data['comments'] = comments_match.group(1).strip()
        
        results.append(paper_data)
    
    return results

def fetch_arxiv_papers(query, api_auth, max_papers):
    """
    Fetch arXiv papers using the Jina API and extract paper information
    
    Args:
        query: Search query for arXiv
        
    Returns:
        List of dictionaries containing paper information
    """
    url = f'https://r.jina.ai/https://arxiv.org/search/?query={query}&searchtype=all&abstracts=show&order=-submitted_date&size=25'
    headers = {
        'Authorization': f'Bearer {api_auth}',
        'X-Return-Format': 'markdown'  # Use markdown format
    }
    
    response = requests.get(url, headers=headers)
        
    # Extract the markdown content from the response
    markdown_content = response.text
    papers = extract_arxiv_papers(markdown_content, max_papers=max_papers)
    
    return papers

def main(query:str, api_auth:str, max_papers: int) -> dict:
    # Fetch papers
    papers = fetch_arxiv_papers(query=query, api_auth=api_auth, max_papers=max_papers)
    result = json.dumps(papers, indent=2)

    return {
        "result": result
    }


if __name__ == "__main__":

    # test extract_arxiv_papers
    with open("sample.text", "r") as f:
        markdown_content = f.read()

    papers = extract_arxiv_papers(markdown_content, max_papers=5)
    with open("extracted_papers.json", "w", encoding="utf-8") as out_f:
        json.dump(papers, out_f, ensure_ascii=False, indent=2)