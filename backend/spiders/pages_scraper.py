# -*- coding: utf-8 -*-
import re
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class PageSpider(scrapy.Spider):
    name = "page"
    start_urls = ['http://blog.theodo.fr/']

    def parse(self, response):
        for article_url in response.css('.entry-title a ::attr("href")').extract():
            yield response.follow(article_url, callback=self.parse_article)

    def parse_article(self, response):
        content = response.xpath(".//div[@class='entry-content']/descendant::text()").extract()
        yield {'article': ''.join(content)}
