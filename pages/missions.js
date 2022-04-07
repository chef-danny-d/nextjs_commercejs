import { Loader } from '../components/util'
import { fetcher } from '@/util/fetcher'
import { FaTrophy } from 'react-icons/fa'
import { ListOfCourses, Webinar } from '../components/Courses'
import axios from 'axios'
import qs from 'qs'
import { useContext } from 'react'
import { UserContext } from '../pages/_app'
import { getSession } from 'next-auth/client'

export default function Course({ courses, explorer, webinar }) {
	/* pulling user's context from _app */
	const { user } = useContext(UserContext)

	return !courses || !explorer ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-3/4">
				<div className="w-full flex flex-row justify-between bg-gray-100 shadow-md border px-4 py-6 rounded">
					<div className="w-1/2 mr-2">
						<h1 className="text-3xl font-semibold">
							Welcome back {user?.name || ''}!
						</h1>
						<p className="text-gray-600 font-light text-base leading-loose">
							You are on a {245} day learning streak. Extend your
							streak by completing a lessons today.
						</p>
					</div>
					<div className="w-1/2 flex flex-col ml-2 justify-center">
						<div className="flex flex-row w-full items-center justify-end mb-2">
							<FaTrophy
								fontSize={32}
								className="text-gray-400 mr-4"
							/>
							<h2 className="text-xl text-gray-400 w-full font-semibold">
								Complete{' '}
								<span className="text-black">{15}</span> more
								lessons to level up
							</h2>
						</div>
						<div className="relative w-full">
							<span className="absolute bg-ncrma-600 rounded-full font-bold text-white w-1/3 px-4 py-1 top-0 left-0">
								LEVEL {2}
							</span>
							<span className="block text-right bg-ncrma-400 rounded-full font-bold text-white w-full px-4 py-1 ">
								LEVEL {3}
							</span>
						</div>
					</div>
				</div>
				<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{/* {explorer.missions.map((course, index) => (
						<ListOfCourses key={index} course={course} />
					))} */}
				</div>
				<h1 className="text-4xl font-semibold mt-5">
					Recommended Courses
				</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{courses.map((course, index) => (
						<ListOfCourses key={index} course={course} />
					))}
				</div>
			</section>
			<Webinar webinar={webinar[0]} />
		</div>
	)
}

export async function getServerSideProps({ ctx }) {
	const session = await getSession(ctx)
	// TODO: figure out a way to block requests from users who don't have a session
	if (false) {
		// was !sessions before
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false
			}
		}
	} else {
		// const q = qs.stringify(
		// 	{
		// 		populate: {
		// 			stages: {
		// 				populate: {
		// 					videos: {
		// 						populate: '*'
		// 					}
		// 				},
		// 				sort: 'order_in_course'
		// 			},
		// 			instructors: {
		// 				populate: '*'
		// 			},
		// 			cover: {
		// 				populate: '*'
		// 			},
		// 			enrollments: {
		// 				populate: {
		// 					user: {
		// 						populate: '*'
		// 					}
		// 				}
		// 			}
		// 		}
		// 	},
		// 	{
		// 		encodeValuesOnly: true
		// 	}
		// )
		// const missions = await axios.get(`http://localhost:1337/api/missions?${q}`)

		// const profileQuery = qs.stringify(
		// 	{
		// 		populate: {
		// 			enrollments: {
		// 				populate: {
		// 					mission: {
		// 						populate: '*'
		// 					},
		// 					user: {
		// 						populate: '*'
		// 					}
		// 				}
		// 			}
		// 		}
		// 	},
		// 	{
		// 		encodeValuesOnly: true
		// 	}
		// )
		// const profile = await axios.get(
		// 	`http://localhost:1337/api/profiles?${profileQuery}`
		// )

		const explorer = await fetcher(`
    *[_type == 'explorer']{
        ...,
        achievements[] -> {...},
        missions[] -> {
            ...,
            coverImage{
            	asset ->
            },
            instructors[]-> {_id, name},
			enrollment[]->{...}
        }
    }`)

		const course = await fetcher(`*[_type == 'mission']{
                ...,
                coverImage{
                    asset->
                },
                instructors[]-> {_id, name},
                stages[]->{title, slug},
				enrollment[]->{...}
        }`)

		const webinar = await fetcher(`*[_type == 'webinar' ]{
  ...,
  presenters[]->{
    ...,
    avatar {
    ...,
    asset ->
  }
  },
}`)

		if (!course) {
			return {
				notFound: true
			}
		} else {
			return {
				props: {
					courses: course,
					explorer,
					webinar
					// missions: missions.data.data,
					// profile: profile.data.data
				}
			}
		}
	}
}
