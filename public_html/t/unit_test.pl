#!/usr/bin/perl

use strict;
use warnings;

use Test::More tests => 17;

#includes
use DBI;
use CGI 'param';
use JSON;
use JSON::Parse ':all';
use Person;
use Template;
use Test::WWW::Jasmine;

##connect to the database
my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

ok(defined $dbhandle, 'Connected to the database');

##test entry.cgi

#pass entry.cgi some parameters, surpressing the output
param('fname', 'foo');
param('lname', 'bar');
param('email', 'foobar@qps.com');

open(my $nullFH, '>', '/dev/null');
my $stdoutFH = select $nullFH;

require_ok('entry.cgi');

select $stdoutFH;
close $nullFH;

#find those debugging values
my $sthandle = $dbhandle->prepare('SELECT fname, lname, email FROM mailinglist WHERE fname = "foo" AND lname = "bar" AND email = "foobar@qps.com";');

$sthandle->execute() or die $DBI::errstr;

my $varcount = 0;
while(my @row = $sthandle->fetchrow_array()) {
	$varcount++;
}

$sthandle->finish();

is($varcount, 1, 'Number of debugging entries found (entry.cgi)');

##test dump_database.cgi
require_ok('dump_database.cgi');

$sthandle = $dbhandle->prepare('SELECT fname, lname, email FROM mailinglist;');
$sthandle->execute();
my @dbdump = dump_database($sthandle);
$sthandle->finish();

#check the dump
$varcount = 0;
foreach my $row (@dbdump) {
	if (%$row->{fname} eq 'foo' and %$row->{lname} eq 'bar' and %$row->{email} eq 'foobar@qps.com') {
		$varcount++;
	}
}
is($varcount, 1, 'Number of debugging entries found (dump_database.cgi)');

##test refresh.cgi

#get the output from refresh.cgi
my $output;
open(my $outputFH, '>', \$output) or die;
my $oldFH = select $outputFH;

do('refresh.cgi');

select $oldFH;
close $outputFH;

#output = string, output2 = array, output3 = string, screendump = array
my @screendump;
{
	my @output2 = grep {/\S/} split("\n",$output);
	shift @output2;
	my $output3 = join("\n",@output2);
	@screendump = parse_json($output3);
}

#compare dbdump to screendump
my $ret = 1;
for (my $i = 0; $i < @dbdump; $i++) {
	while (my ($key, $value) = each $screendump[0][$i]) {
		if ($dbdump[$i]{$key} ne $value) {
			$ret = 0;
		}
	}
}

is($ret, 1, 'screendump matches the database dump');

##test Person.pm

my $person = Person->new;
ok($person->SetFirstName('kayne') eq 'kayne', 'Person::SetFirstName()');
ok($person->SetLastName('ruse') eq 'ruse', 'Person::SetLastName()');
ok($person->SetEmail('kayneruse@gmail.com') eq 'kayneruse@gmail.com', 'Person::SetEmail()');

ok($person->GetFirstName() eq 'kayne', 'Person::GetFirstName()');
ok($person->GetLastName() eq 'ruse', 'Person::GetLastName()');
ok($person->GetEmail() eq 'kayneruse@gmail.com', 'Person::GetEmail()');

##check that the front end can parse the given JSON

#output unordered list to a string
my $template = Template->new({
	INCLUDE_PATH => ['/var/www/helloworld.qps.local/public_html']
});

$output = '';
$template->process("unordered_list.tt", {entries => \@dbdump}, \$output);

#get check how many lines correspond to the debug entry
my @lines = grep { /<li>.*foobar\@qps.com.*<\/li>/ } split("\n", $output);
is(scalar @lines, 1, "Result parsed from the front end");

##Check the return codes from the server

ok(`curl -s -o /dev/null -I -w "%{http_code}" helloworld.qps.local`==200, 'return code 200');
ok(`curl -s -o /dev/null -I -w "%{http_code}" helloworld.qps.local/t/missing.cgi` == 404, 'return code 404');
ok(`curl -s -o /dev/null -I -w "%{http_code}" helloworld.qps.local/t/broken.cgi` == 500, 'return code 500');

##test the front end (done in JavaScript)

my @results = grep { /.*Executed 2 of 2 SUCCESS.*/ } `node t/node_modules/karma/bin/karma start t/karma.conf.js`;

ok(@results != 0, '2/2 Reported from JavaScript front end');

##Remove those debugging values from the database
$sthandle = $dbhandle->prepare('DELETE FROM mailinglist WHERE fname = "foo" AND lname = "bar";');
$sthandle->execute() or die $DBI::errstr;
$sthandle->finish();

##finally
$dbhandle->disconnect();
