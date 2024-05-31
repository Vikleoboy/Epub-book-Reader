import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

book = epub.read_epub('./test.epub')

print(book.title)

items = []


for item in book.get_items():
    if item.get_type() == ebooklib.ITEM_DOCUMENT:

        items.append({'id': item.get_id(
        ), 'chap': item.get_name(), 'cont': item.get_content()})

    # if item.get_type() == ebooklib.ITEM_IMAGE:
    #     print(item)

    if item.get_type() == ebooklib.ITEM_COVER:
        print(item.get_full_href())

        # items.append({'id': item.get_id(
        # ), 'chap': item.get_name(), 'cont': item.get_content()})

       # print('==================================')
       # print('NAME : ', item.get_name())
       # print('Id ', item.get_id())
       # print('Id ', item.is_chapter())
       # print('----------------------------------')
       # print(item.get_content())
       # print('==================================')


# print(book.get_item_with_id('cover-image'))

# def ix(self, dict, n):
#     count = 0
#     for i in sorted(dict.keys()):
#         if n == count:
#             return i
#         else:
#             count += 1


# print(items[0]['chap'])

# soup = BeautifulSoup(items[0]['cont'], 'xml')

# headers = [header.get_text().split('\n')[0] for header in soup.find_all('p')]
# print(headers)
# img = soup.find('img')
# print(soup.prettify())
# print(img['src'])
# print(book.metadata)
