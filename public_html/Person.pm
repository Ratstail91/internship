#!/usr/bin/perl

package Person;

use strict;
use warnings;

sub new {
	my ($class, %args) = @_;
	return bless { %args }, $class;
}

sub SetFirstName {
	my ($self, $fname) = @_;
	return $self->{fname} = $fname;
}

sub GetFirstName {
	my ($self) = @_;
	return $self->{fname};
}

sub SetLastName {
        my ($self, $lname) = @_;
        return $self->{lname} = $lname;
}

sub GetLastName {
        my ($self) = @_;
        return $self->{lname};
}

sub SetEmail {
        my ($self, $email) = @_;
        return $self->{email} = $email;
}

sub GetEmail {
        my ($self) = @_;
        return $self->{email};
}

sub TO_JSON {
	return { %{ shift() } };
}

1;
