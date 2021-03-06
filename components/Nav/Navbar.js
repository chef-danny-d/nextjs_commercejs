import { useSession, signIn, signOut } from 'next-auth/client'
import ActiveLink from './ActiveLink'
import { Loader } from '../util'
import Image from 'next/image'
import { RiShutDownLine } from 'react-icons/ri'
import { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../pages/_app'
import { BsFillPersonFill } from 'react-icons/bs'
import { fetcher } from '@/util/fetcher'
import imgConstructor, { configuredSanityClient } from '@/util/img'
import { useNextSanityImage } from 'next-sanity-image'
import Link from 'next/link'

export default function Navbar() {
	const [session, loading] = useSession()
	const [avatar, setAvatar] = useState(null)
	const { setUser, user } = useContext(UserContext)

	useEffect(() => {
		const query = `
			*[_type == 'user' && email == '${session?.user?.email}']{
				...,
				avatar {
					asset ->
				}
			}{...}
			`
		fetcher(query)
			.then(async (usr) => {
				const profile = await usr.pop()
				setUser(await profile)
				// setAvatar(imgConstructor(await profile?.avatar?.asset))
			})
			.catch((err) => {
				throw Error(err)
			})
	}, [session])

	return loading ? null : (
		<nav className={`w-full h-16 border-b border-gray-200 px-10`}>
			<ul className={`flex flex-row justify-between items-center h-full`}>
				<div className="flex flex-row justify-between items-center h-full lg:w-1/3 w-1/2 text-gray-500 font-semibold">
					<ActiveLink
						href={`/`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Home</a>
					</ActiveLink>
					<ActiveLink
						href={`/my-learning`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>My Learning</a>
					</ActiveLink>
					<ActiveLink
						href={`/missions`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Courses</a>
					</ActiveLink>
					<ActiveLink
						href={`/certs`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Certificates</a>
					</ActiveLink>
				</div>
				<div className="lg:w-1/2 w-1/2 flex justify-end">
					{!session ? (
						<button
							className="bg-ncrma-400 font-bold text-white uppercase px-6 py-2 rounded leading-loose tracking-wide"
							onClick={() =>
								signIn(undefined, {
									callbackUrl:
										'http://localhost:3000/auth/welcome'
								})
							}
						>
							Sign in
						</button>
					) : (
						<>
							<button
								className="bg-ncrma-400 font-bold text-white uppercase xl:px-6 px-3 py-2 rounded leading-loose tracking-wide xl:mr-12 mr-1"
								onClick={() =>
									alert(
										'Purchase membership to access exclusive features'
									)
								}
							>
								no membership
							</button>
							<Link
								href={
									user ? `user/student/${user._id}` : '/user'
								}
								passHref={true}
							>
								<a>
									<div className="bg-ncrma-100 rounded-lg xl:px-5 px-3 py-2 flex flex-row items-center">
										<div className="h-8 w-8 rounded-full mr-2 overflow-hidden">
											<BsFillPersonFill size={30} />
										</div>

										<span
											className={`inline-block capitalize mr-2 font-semibold leading-loose tracking-wide`}
										>
											{user?.firstName.toLowerCase()}
										</span>
										<button
											className="cursor-pointer"
											onClick={() => signOut()}
										>
											<RiShutDownLine />
										</button>
									</div>
								</a>
							</Link>
						</>
					)}
				</div>
			</ul>
		</nav>
	)
}
