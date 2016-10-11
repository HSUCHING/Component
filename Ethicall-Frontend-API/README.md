API

Faker.fake()

faker.js contains a super useful generator method Faker.fake for combining faker API methods using a mustache string format.

Example:

console.log(faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}"));
// outputs: "Marks, Dean Sr."
This will interpolate the format string with the value of methods name.lastName(), name.firstName(), and name.suffix()

JSDoc API Browser

http://marak.github.io/faker.js/

API Methods

address
zipCode
city
cityPrefix
citySuffix
streetName
streetAddress
streetSuffix
streetPrefix
secondaryAddress
county
country
countryCode
state
stateAbbr
latitude
longitude
commerce
color
department
productName
price
productAdjective
productMaterial
product
company
suffixes
companyName
companySuffix
catchPhrase
bs
catchPhraseAdjective
catchPhraseDescriptor
catchPhraseNoun
bsAdjective
bsBuzz
bsNoun
date
past
future
between
recent
month
weekday
fake
finance
account
accountName
mask
amount
transactionType
currencyCode
currencyName
currencySymbol
bitcoinAddress
hacker
abbreviation
adjective
noun
verb
ingverb
phrase
helpers
randomize
slugify
replaceSymbolWithNumber
replaceSymbols
shuffle
mustache
createCard
contextualCard
userCard
createTransaction
image
image
avatar
imageUrl
abstract
animals
business
cats
city
food
nightlife
fashion
people
nature
sports
technics
transport
internet
avatar
email
exampleEmail
userName
protocol
url
domainName
domainSuffix
domainWord
ip
userAgent
color
mac
password
lorem
word
words
sentence
sentences
paragraph
paragraphs
text
lines
name
firstName
lastName
findName
jobTitle
prefix
suffix
title
jobDescriptor
jobArea
jobType
phone
phoneNumber
phoneNumberFormat
phoneFormats
random
number
arrayElement
objectElement
uuid
boolean
word
words
image
locale
alphaNumeric
system
fileName
commonFileName
mimeType
commonFileType
commonFileExt
fileType
fileExt
directoryPath
filePath
semver
Localization

As of version v2.0.0 faker.js has support for multiple localities.

The default language locale is set to English.

Setting a new locale is simple:

// sets locale to de
faker.locale = "de";
de
de_AT
de_CH
en
en_AU
en_BORK
en_CA
en_GB
en_IE
en_IND
en_US
en_au_ocker
es
es_MX
fa
fr
fr_CA
ge
id_ID
it
ja
ko
nb_NO
nep
nl
pl
pt_BR
ru
sk
sv
tr
uk
vi
zh_CN
zh_TW