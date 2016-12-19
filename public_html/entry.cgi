#!/usr/bin/perl

use strict;
use warnings;

use CGI ":standard";
use DBI;

#supress warning
$CGI::LIST_CONTEXT_WARN = 0;

#begin output
print "Content-type:text/html\n\n";

#enter the name/email pair into the table
my $fname = escapeHTML(param('fname'));
my $lname = escapeHTML(param('lname'));
my $email = escapeHTML(param('email'));
my $birthdate = escapeHTML(param('birthdate'));
my $income = escapeHTML(param('income'));

#check the input
if ($fname eq '' or $lname eq '' or $email !~ /..*@..*\...*/ or $birthdate !~ /....-..-../) {
	return;
}

#enter it into the database
my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

my $sthandle = $dbhandle->prepare("INSERT INTO mailinglist (fname,lname,email,birthdate,income) VALUES (\"$fname\",\"$lname\",\"$email\",\"$birthdate\",\"$income\");");

$sthandle->execute() or die $DBI::errstr;
$sthandle->finish();

$dbhandle->disconnect();

