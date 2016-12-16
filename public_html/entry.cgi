#!/usr/bin/perl

use strict;
use warnings;

use CGI ":standard";
use DBI;

print "Content-type:text/html\n\n";

#enter the name/email pair into the table
my @fname = grep {/..*/} param('fname');
my @lname = grep {/..*/} param('lname');
my @email = grep {/.*@..*\...*/} param('email');

if (@fname == 0) {
	return;
}

if (@lname == 0) {
	return;
}

if (@email == 0) {
	return;
}

my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

my $sthandle = $dbhandle->prepare("INSERT INTO mailinglist (fname,lname,email) VALUES (\"$fname[0]\",\"$lname[0]\",\"$email[0]\");");

$sthandle->execute() or die $DBI::errstr;
$sthandle->finish();

$dbhandle->disconnect();

