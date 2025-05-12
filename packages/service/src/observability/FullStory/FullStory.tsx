import React from "react";
import {
  useInstallFullStory,
  useIdentifyToFullStory,
} from "@zapier/react-fullstory";

interface User {
  id: string; // customuserId of user
  fullName: string;
  email: string;
  [key: string]: string; // any other fields are acceptable here
}

interface Props {
  user: User | undefined;
  disableFullStory?: boolean;
}

interface FullStoryIdentifyProps {
  user: User;
}

const FullStoryIdentify = ({ user }: FullStoryIdentifyProps) => {
  useIdentifyToFullStory(user);

  return null;
};

const FullStoryContainer = ({ user, disableFullStory }: Props) => {
  // can be disabled conditionally from the consumer side, see:
  // https://github.com/zapier/fullstory/tree/main/packages/react-fullstory#disabled-mode
  const shouldRecordFullStory = !disableFullStory;

  // only initialize FullStory if shouldRecordFullStory is truthy
  useInstallFullStory({ isDisabled: !shouldRecordFullStory });

  // only identify user to FullStory if user is defined
  if (shouldRecordFullStory && !!user) {
    return <FullStoryIdentify user={user as User} />;
  }

  return null;
};

export default FullStoryContainer;
