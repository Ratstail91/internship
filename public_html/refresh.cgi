#!/usr/bin/perl
use strict;
use warnings;

use DBI;
use Person;
use JSON;

#includes
require "dump_database.cgi";

#setup the page's components
print "Content-type:text/html\n\n";

#retrieve the query from the test database
my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

my $sthandle = $dbhandle->prepare("SELECT fname, lname, email, birthdate, income FROM mailinglist;");

$sthandle->execute() or die $DBI::errstr;

#save the rows and disconnect from the database
my @dbdump = dump_database($sthandle);

$sthandle->finish();
$dbhandle->disconnect();

#print the dumped database to the screen
my $json = JSON->new->utf8;
$json = $json->convert_blessed(1);
$json = $json->pretty(1);
$json = $json->encode(\@dbdump);

print $json;
