import { useState } from "react";
import { User, LogOut, Cloud, CloudUpload, CloudDownload, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import "./UserMenu.css";

interface UserMenuProps {
	onOpenLogin: (mode?: "login" | "register") => void;
}

export function UserMenu({ onOpenLogin }: UserMenuProps) {
	const { user, isAuthenticated, isLoading, logout, pullCloudSave, pushCloudSave } = useAuthStore();
	const [menuOpen, setMenuOpen] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [syncMsg, setSyncMsg] = useState("");

	if (isLoading) {
		return (
			<div className="user-menu-loading">
				<RefreshCw size={16} className="spin" />
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return (
			<div className="nav-auth-group">
				<button className="nav-register-btn" onClick={() => onOpenLogin("register")}>
					注册
				</button>
				<button className="nav-login-btn" onClick={() => onOpenLogin("login")}>
					<User size={15} />
					登录
				</button>
			</div>
		);
	}

	const handleSync = async (dir: "pull" | "push") => {
		setSyncing(true);
		setSyncMsg("");
		const res = dir === "pull" ? await pullCloudSave() : await pushCloudSave();
		setSyncMsg(res.ok ? (dir === "pull" ? "云端进度已同步" : "进度已上传云端") : (res.message || "同步失败"));
		setSyncing(false);
		setTimeout(() => setSyncMsg(""), 2500);
	};

	const handleLogout = () => {
		logout();
		setMenuOpen(false);
	};

	return (
		<div className="user-menu">
			<button
				className="user-avatar-btn"
				onClick={() => setMenuOpen(!menuOpen)}
				title={user.nickname ?? user.username ?? "用户"}
			>
				<div className="user-avatar">
					{(user.nickname ?? user.username ?? "?").slice(0, 1)}
				</div>
			</button>

			{menuOpen && (
				<>
					<div className="user-menu-backdrop" onClick={() => setMenuOpen(false)} />
					<div className="user-dropdown">
						<div className="user-dropdown-header">
							<div className="user-dropdown-avatar">
								{(user.nickname ?? user.username ?? "?").slice(0, 1)}
							</div>
							<div className="user-dropdown-info">
								<div className="user-dropdown-name">{user.nickname ?? user.username ?? "未命名"}</div>
							<div className="user-dropdown-username">@{user.username ?? "未知"}</div>
							</div>
							<Cloud size={14} className="cloud-badge" />
						</div>

						<div className="user-dropdown-sync">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleSync("pull")}
								disabled={syncing}
							>
								<CloudDownload size={14} />
								{syncing ? "同步中..." : "下载云端"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleSync("push")}
								disabled={syncing}
							>
								<CloudUpload size={14} />
								{syncing ? "同步中..." : "上传云端"}
							</Button>
						</div>

						{syncMsg && (
							<div className={`sync-msg ${syncMsg.includes("失败") ? "error" : "ok"}`}>
								{syncMsg}
							</div>
						)}

						<div className="user-dropdown-divider" />

						<button className="user-dropdown-item danger" onClick={handleLogout}>
							<LogOut size={16} />
							退出登录
						</button>
					</div>
				</>
			)}
		</div>
	);
}
