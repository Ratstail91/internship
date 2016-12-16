#!/usr/bin/perl
use strict;
use warnings;

use Template;

#setup the page's components
my $template = Template->new({
	INCLUDE_PATH => ['/var/www/helloworld.qps.local/public_html'],
});

#show the input field
$template->process("index.tt", {
	fname => "fname",
	lname => "lname",
	email => "email"
});
