/**
 * 规则应用示例 - 展示如何在代码中遵循开发规则
 * 这个文件演示了所有规则的实际应用
 */

import React, { Suspense } from 'react';
import { rulesManager, RulesEnforcer } from './loader';

// 遵循命名约定：使用描述性变量名和辅助动词
interface UserProfileProps {
	userId: string;
	isLoading: boolean;
	hasError: boolean;
	userData: UserData | null;
}

interface UserData {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

// 遵循代码结构：导出的组件、子组件、辅助函数、静态内容、类型
function UserProfile({ userId, isLoading, hasError, userData }: UserProfileProps) {
	// 遵循错误处理：早期返回，保护子句
	if (isLoading) {
		return <UserProfileSkeleton />;
	}

	if (hasError) {
		return <UserProfileError userId={userId} />;
	}

	if (!userData) {
		return <UserProfileNotFound userId={userId} />;
	}

	// 快乐路径放在最后
	return (
		<div className="user-profile">
			<UserProfileHeader user={userData} />
			<UserProfileDetails user={userData} />
			<UserProfileActions userId={userId} />
		</div>
	);
}

// 子组件：使用function关键字，遵循命名约定
function UserProfileHeader({ user }: { user: UserData }) {
	return (
		<header className="profile-header">
			<img 
				src={user.avatar} 
				alt={`${user.name}'s avatar`}
				className="profile-avatar"
				loading="lazy"
			/>
			<h1 className="profile-name">{user.name}</h1>
		</header>
	);
}

function UserProfileDetails({ user }: { user: UserData }) {
	return (
		<section className="profile-details">
			<div className="detail-item">
				<label>Email:</label>
				<span>{user.email}</span>
			</div>
			<div className="detail-item">
				<label>User ID:</label>
				<span>{user.id}</span>
			</div>
		</section>
	);
}

function UserProfileActions({ userId }: { userId: string }) {
	const handleEdit = () => {
		// 使用描述性函数名
		console.log('Editing user profile:', userId);
	};

	const handleDelete = () => {
		// 遵循安全第一：确认删除操作
		if (window.confirm('Are you sure you want to delete this profile?')) {
			console.log('Deleting user profile:', userId);
		}
	};

	return (
		<footer className="profile-actions">
			<button 
				onClick={handleEdit}
				className="btn btn-primary"
				type="button"
			>
				Edit Profile
			</button>
			<button 
				onClick={handleDelete}
				className="btn btn-danger"
				type="button"
			>
				Delete Profile
			</button>
		</footer>
	);
}

// 辅助函数：使用function关键字，省略分号
function UserProfileSkeleton() {
	return (
		<div className="user-profile skeleton">
			<div className="skeleton-avatar" />
			<div className="skeleton-name" />
			<div className="skeleton-details" />
		</div>
	);
}

function UserProfileError({ userId }: { userId: string }) {
	return (
		<div className="user-profile error">
			<h2>Error Loading Profile</h2>
			<p>Failed to load profile for user: {userId}</p>
			<button 
				onClick={() => window.location.reload()}
				className="btn btn-primary"
				type="button"
			>
				Retry
			</button>
		</div>
	);
}

function UserProfileNotFound({ userId }: { userId: string }) {
	return (
		<div className="user-profile not-found">
			<h2>Profile Not Found</h2>
			<p>No profile found for user: {userId}</p>
		</div>
	);
}

// 静态内容：放在文件末尾
const PROFILE_STYLES = {
	container: 'user-profile',
	header: 'profile-header',
	avatar: 'profile-avatar',
	name: 'profile-name',
	details: 'profile-details',
	actions: 'profile-actions',
} as const;

// 类型定义：放在文件末尾
type ProfileStyleKey = keyof typeof PROFILE_STYLES;

// 规则验证示例
function validateProfileCode() {
	const code = `
		function UserProfile({ userId, isLoading, hasError, userData }) {
			if (isLoading) return <Skeleton />;
			if (hasError) return <Error />;
			return <Profile user={userData} />;
		}
	`;

	const violations = RulesEnforcer.validateCode(code, ['code-style', 'typescript']);
	
	if (violations.length > 0) {
		console.warn('Code validation violations:', violations);
	} else {
		console.log('✅ Code follows all rules');
	}
}

// 规则摘要示例
function showRulesSummary() {
	const summary = RulesEnforcer.getRulesSummary();
	console.log('📋 Development Rules Summary:');
	console.log(summary);
}

// 导出组件（遵循命名导出约定）
export { UserProfile };
export default UserProfile;

// 导出类型和工具函数
export type { UserProfileProps, UserData, ProfileStyleKey };
export { PROFILE_STYLES, validateProfileCode, showRulesSummary };
