import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import Communications from 'react-native-communications';

import {
  ViewContainer,
  UserProfile,
  LoadingMembersList,
  MembersList,
  SectionList,
  ParallaxScroll,
} from 'components';
import { colors, fonts } from 'config';
import { getOrg, getOrgRepos, getOrgMembers } from '../index';

const mapStateToProps = state => ({
  organization: state.organization.organization,
  repositories: state.organization.repositories,
  members: state.organization.members,
  isPendingOrg: state.organization.isPendingOrg,
  isPendingRepos: state.organization.isPendingRepos,
  isPendingMembers: state.organization.isPendingMembers,
});

const mapDispatchToProps = dispatch => ({
  getOrgByDispatch: orgName => dispatch(getOrg(orgName)),
  getOrgReposByDispatch: url => dispatch(getOrgRepos(url)),
  getOrgMembersByDispatch: orgName => dispatch(getOrgMembers(orgName)),
});

const styles = StyleSheet.create({
  listTitle: {
    color: colors.black,
    ...fonts.fontPrimary,
  },
});

class OrganizationProfile extends Component {
  props: {
    getOrgByDispatch: Function,
    // getOrgReposByDispatch: Function,
    getOrgMembersByDispatch: Function,
    organization: Object,
    // repositories: Array,
    members: Array,
    isPendingOrg: boolean,
    // isPendingRepos: boolean,
    isPendingMembers: boolean,
    navigation: Object,
  };

  componentDidMount() {
    const organization = this.props.navigation.state.params.organization;

    this.props.getOrgByDispatch(organization.login);
    this.props.getOrgMembersByDispatch(organization.login);
  }

  render() {
    const {
      organization,
      members,
      isPendingOrg,
      isPendingMembers,
      navigation,
    } = this.props;
    const initialOrganization = this.props.navigation.state.params.organization;

    return (
      <ViewContainer>
        <ParallaxScroll
          renderContent={() =>
            <UserProfile
              type="org"
              initialUser={initialOrganization}
              user={
                initialOrganization.login === organization.login
                  ? organization
                  : initialOrganization
              }
              navigation={navigation}
            />}
          stickyTitle={organization.name}
          navigateBack
          navigation={navigation}
        >
          {isPendingMembers && <LoadingMembersList title="MEMBERS" />}

          {!isPendingMembers &&
            <MembersList
              title="MEMBERS"
              members={members}
              navigation={navigation}
            />}

          {!!(
            !isPendingOrg &&
            organization.blog &&
            organization.blog !== null &&
            organization.blog !== ''
          ) &&
            <SectionList title="LINKS">
              <ListItem
                title="Website"
                titleStyle={styles.listTitle}
                leftIcon={{ name: 'link', color: colors.grey }}
                subtitle={organization.blog}
                onPress={() => Communications.web(organization.blog)}
                underlayColor={colors.greyLight}
              />
            </SectionList>}
        </ParallaxScroll>
      </ViewContainer>
    );
  }
}

export const OrganizationProfileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationProfile);
