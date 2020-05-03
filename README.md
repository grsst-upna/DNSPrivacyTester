# DNSPrivacyTester
Code for paper "On the reduction of authoritative DNS cache timeouts: detection and implications in user privacy"

### Overview

This is the code for the files that we used for our public web tool identified by the URL dnsprivacytester.tlm.unavarra.es.

### Implementation

To implement the tool we will need to have a web server with an operative MySQL database where we can store the identification of each of the tests that are run by using the website as well as php enabled to work in the web server.

####MySQL

In this project we created two different MySQL tables one created to store the identification data of the test being performed (Identification code of the results file, IP, Timestamp of when the test was started, user agent, ISP of the user...) and another one where the result of the test was stored for the IP taking it (wether its privacy was being compromised or not and the ISP being used). 

You can find more information about the fields used in this tables on te php files "analisis.php" and  "ISPdata.php", where their data is inserted.

####Text files

The times needed to resolve each one of the DNS requests will be stored in an external text file inside a directory. In the files that we uploaded this directory is called "results" and it can be found for example at the file "analisis.php".

####The domain

It will also be needed that the domain hosting the service has been enabled as a "wildcard" domain, so that by querying a random subdomain of the main domain of the service, it can be retrieved information from the same server, so that every new dns request is being made by each user. 

This can be achived by adding a register with the character "*" in front of the domain name being used at its authoritative DNS server.

Please change the domain name located in the .js files to the one you are using.

####HTTP and not HTTPS

The API that we are using to capture the DNS resolution times will only perform this task if the service is located at a server without the HTTPS service enabled, because the API will only read data from resources from other subdomains if they are served from URLs using an HTTP service.


### Accessing the data

After the test has been completed, you can access the text files with the DNS resolution times observed during the test by using the identification code of the test and searching it in the directory where the results are being stored. 
