import { ChannelMembersEntity } from '@mezon/store';
import { MemberProfileType } from '@mezon/utils';
import MemberItem from './MemberItem';

type ListMemberProps = {
	lisMembers: ChannelMembersEntity[];
	isOffline: boolean;
};

const ListMember = (props: ListMemberProps) => {
	const { lisMembers, isOffline } = props;
	return lisMembers.map((user) => (
		<MemberItem
			name={user.clan_nick || user?.user?.display_name || user?.user?.username}
			user={user}
			key={user?.user?.id}
			listProfile={true}
			isOffline={isOffline}
			positionType={MemberProfileType.MEMBER_LIST}
		/>
	));
};

export default ListMember;
