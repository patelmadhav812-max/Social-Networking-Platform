import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";
// last work to do is implement the token expiry and email send code and email correct code in model
// 29-08-26 complete navbar
// 31-08-26 complete login page bass ek function or useEff rehe gya hai fir dashboard kal karunga last 8 video time 18:50
// 1 -09 - 26 complete dashboard page functionality and tomorrow  i will complete the dashboard page UI
// 4 - 09 - 26 little bit css last 5 time 10;42
// 5 - 09 - 26 styling UI for getting a post
// 6 - 09 - 26 showing post wagera in UI Video at last 3rd time:- 14:46
// 7 - 09 - 26 i complete the upload part of the post section
// 8- 09-26 i completed the ui design of the post section
// 9 - 09 - 26 apply the delete functionality for deleting the post and completing the add comment and like in post section
// 10-09-26  adding discover page ui and functionality
// 11 -09 - 26 adding the profile page functionality
// 12 - 09 - 26 add the connection page and complete the discover page with view_page also
// 13 - 09 - 26 connectrequest wali functionality khatam kari connect - connected and profile page banaya use gpt = babajikibuti
// 14-09-26 humne edit profilepicture and edit name work kiya with using madpat and humne eduction wala jodna hain

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>

            <p>A True social media platform, with stories no bluffs!</p>

            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer_right}>
            <img src="/images/download.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
