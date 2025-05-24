import requests
from bs4 import BeautifulSoup
import json

def scrape_scholar_profile(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    publications = []

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')

    for item in soup.find_all('tr', class_='gsc_a_tr'):
        title_tag = item.find('a', class_='gsc_a_at')
        title = title_tag.text if title_tag else 'N/A'
        # Construct absolute URL if the link is relative
        url = title_tag['href'] if title_tag else 'N/A'
        if url.startswith('/'):
            url = "https://scholar.google.com" + url
        
        details = item.find_all('div', class_='gs_gray')
        authors = 'N/A'
        venue_year_line = 'N/A'
        venue = 'N/A'
        year = 'N/A'

        if len(details) > 0:
            authors = details[0].text if details[0] else 'N/A'
        if len(details) > 1:
            venue_year_line = details[1].text if details[1] else 'N/A'
            # Year is usually the last part of the second gs_gray div
            # Venue is everything before that
            # This is a common pattern, but might need refinement
            parts = venue_year_line.split(',')
            if parts:
                year_candidate = parts[-1].strip()
                if year_candidate.isdigit() and len(year_candidate) == 4:
                    year = year_candidate
                    venue = ','.join(parts[:-1]).strip() if len(parts) > 1 else 'N/A'
                else: # Year might not be present or format is different
                    venue = venue_year_line # Keep the whole line as venue if year parsing fails
            else:
                venue = venue_year_line


        publication_data = {
            'title': title,
            'authors': authors,
            'year': year,
            'venue': venue,
            'url': url
        }
        publications.append(publication_data)

    return publications

def save_publications_to_json(publications, filename="publications.json"):
    if publications is None:
        print("No publications to save.")
        return

    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(publications, f, ensure_ascii=False, indent=4)
        print(f"Successfully saved {len(publications)} publications to {filename}")
    except IOError as e:
        print(f"Error saving data to JSON file: {e}")

if __name__ == "__main__":
    scholar_url = "https://scholar.google.com/citations?user=K6gjOxwAAAAJ&hl=en"
    scraped_data = scrape_scholar_profile(scholar_url)
    if scraped_data:
        save_publications_to_json(scraped_data)
    else:
        # Create an empty publications.json if scraping fails or returns no data
        # as per the instructions implicitly requiring publications.json
        save_publications_to_json([])
