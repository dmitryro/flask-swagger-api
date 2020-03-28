#! /usr/bin/env python3

import requests
import colorama
from urllib.request import urlparse, urljoin
from bs4 import BeautifulSoup

# init the colorama module
colorama.init()
GREEN = colorama.Fore.GREEN
GRAY = colorama.Fore.LIGHTBLACK_EX
RESET = colorama.Fore.RESET

# initialize the set of unique links
internal_urls = set()
external_urls = set()

def is_valid(url):
    ''' Check whether 'url' is a valid URL. '''
    if 'None' in url:
        return False
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)


def get_all_page_forms(url):
    ''' Return all URLs that are found on a given page that are within the same website '''
    # domain name of the URL without the protocol
    forms = []

    try:
        domain_name = urlparse(url).netloc
        soup = BeautifulSoup(requests.get(url).content, "html.parser") 

        for form in soup.findAll("form", recursive=True):
            action = form.attrs.get('action', '')
            method = form.attrs.get('method', 'POST')
            name = form.attrs.get('name', '')
            form_id = form.attrs.get('id', '')
            inputs = form.find_all('input', recursive=True)
            textareas = form.find_all('textarea', recursive=True)
            input_list = []    

            for inp in inputs:
                input_dict = {}
                input_dict['id'] = inp.attrs.get('id','')
                input_dict['name'] = inp.attrs.get('name','')
                input_dict['type'] = inp.attrs.get('type','')
                input_dict['placeholder'] = inp.attrs.get('placeholder', '')
                input_dict['value'] = inp.attrs.get('value', '')
                input_list.append(input_dict)

            fd = {}
            fd['fields'] = input_list
            fd['action'] = action
            fd['method'] = method
            fd['name'] = name
            fd['form_id'] = form_id
            forms.append(fd)
    except Exception as e:
        print(f"Error parsing form {e}")
    return forms


def get_all_website_links(url):
    ''' Return all URLs that are found on a given page that are within the same website '''
    urls = set()
    # domain name of the URL without the protocol
    domain_name = urlparse(url).netloc
    soup = BeautifulSoup(requests.get(url).content, "html.parser")
    for a_tag in soup.findAll("a"):
        href = a_tag.attrs.get("href")
        if href == "" or href is None:
            # empty href tag
            continue
        # join the URL if it's relative (i.e. not an absolute link)
        href = urljoin(url, href)
        parsed_href = urlparse(href)
        # remove URL GET parameters, URL fragments, etc.
        href = parsed_href.scheme + "://" + parsed_href.netloc + parsed_href.path

        if not is_valid(href):
            # not a valid URL
            continue
        if href in internal_urls:
            # already in set
            continue
        if domain_name not in href:
            # external link
            if href not in external_urls:
                print(f"{GRAY}[!] External link: {href}{RESET}")
                external_urls.add(href)
            continue
        print(f"{GREEN}[*] Internal link: {href}{RESET}")
        urls.add(href)
        internal_urls.add(href[len(url):])
    return urls


# number of urlse visited so far will be counted
total_urls_visited = 0

def crawl(url, max_urls=50, site_links=[]):
    '''
    Crawl a web page and extract all the links.
    Store the links in external_urls and internal_urls global variables
    params:
      max_urls (int): number of urls to crawl, default is 50.
    '''
    global total_urls_visited
    total_urls_visited += 1
    links = get_all_website_links(url)
    for link in links:
        if total_urls_visited > max_urls:
            return internal_urls
        crawl(link, max_urls=max_urls, site_links=site_links)


if __name__ == "__main__":
    base = "https://lovehate.io"
    site_links = crawl(base, max_urls=20)
    print("[+] Total External links:", len(external_urls))
    print("[+] Total Internal links:", len(internal_urls))
    print("[+] Total:", len(external_urls) + len(internal_urls))
    print(f"[+] Site Links {internal_urls}")
    for url in site_links:
         if '/' in url:
             link = f"{base}{url}"
             forms = get_all_page_forms(link) 
             print(f"Forms found ===> {forms}")

